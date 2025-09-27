from __future__ import annotations

from bs4 import BeautifulSoup
import httpx

from app import extractor


def test_parse_css_for_fonts_filters_non_fonts() -> None:
    css = """
        @font-face { src: url('../fonts/test.woff2') format('woff2'); }
        .hero { background-image: url('images/bg.png'); }
        @import url('//cdn.example.com/nested.css');
    """

    fonts, imports = extractor._parse_css_for_fonts(css, base="https://example.com/styles/main.css")

    assert fonts == {"https://example.com/fonts/test.woff2"}
    assert imports == {"https://cdn.example.com/nested.css"}


def test_extract_text_nodes_ignores_script_and_empty_nodes() -> None:
    html = """
    <html>
      <head><title>Sample</title></head>
      <body>
        <p>Hello <strong>world</strong></p>
        <script>ignored()</script>
      </body>
    </html>
    """
    soup = BeautifulSoup(html, "html.parser")

    nodes = list(extractor._extract_text_nodes(soup))
    rendered = {(node.path, node.content) for node in nodes}

    assert ("[document].html[1].body[1].p[1]", "Hello") in rendered
    assert ("[document].html[1].body[1].p[1].strong[1]", "world") in rendered
    assert all("script" not in path for path, _ in rendered)
    assert all(path != "[document]" for path, _ in rendered)


def test_extract_images_enforces_absolute_http_urls() -> None:
    html = """
    <html>
      <body>
        <img src="/images/a.png" alt="A" />
        <img src="data:image/png;base64,AAAA" alt="inline" />
        <img src="https://cdn.example.com/b.jpg" alt="" />
      </body>
    </html>
    """
    soup = BeautifulSoup(html, "html.parser")

    images = list(extractor._extract_images(soup, base_url=httpx.URL("https://example.com")))
    sources = {img.src for img in images}

    assert "https://example.com/images/a.png" in sources
    assert "https://cdn.example.com/b.jpg" in sources
    assert all(not src.startswith("data:") for src in sources)
    assert any(img.alt is None for img in images)


def test_compose_text_blob_concatenates_nodes() -> None:
    nodes = [
        extractor._TextNode(path="a", content="First"),
        extractor._TextNode(path="b", content="Second"),
    ]

    blob = extractor._compose_text_blob(nodes)

    assert blob == "First\n\nSecond"


def test_extract_navigation_prefers_primary_menu() -> None:
    html = """
    <header>
      <nav class="main-nav">
        <ul>
          <li><a href="/">Home</a></li>
          <li>
            <a href="/services">Services</a>
            <ul>
              <li><a href="/services/therapy">Therapy</a></li>
              <li><a href="/services/coaching">Coaching</a></li>
            </ul>
          </li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </header>
    <footer>
      <nav class="footer-nav">
        <a href="/privacy">Privacy</a>
      </nav>
    </footer>
    """
    soup = BeautifulSoup(html, "html.parser")

    items = extractor._extract_navigation(soup, base_url=httpx.URL("https://example.com"))

    assert [item.title for item in items] == ["Home", "Services", "Contact"]
    services = items[1]
    assert [child.title for child in services.children] == ["Therapy", "Coaching"]
    assert services.href == "https://example.com/services"


def test_extract_navigation_handles_flat_containers() -> None:
    html = """
    <div class="navbar">
      <a href="/home">Home</a>
      <a href="/about">About</a>
      <a href="tel:+15551234567">Call</a>
    </div>
    """
    soup = BeautifulSoup(html, "html.parser")

    items = extractor._extract_navigation(soup, base_url=httpx.URL("https://example.com"))

    assert [item.title for item in items] == ["Home", "About", "Call"]
    assert items[2].href == "tel:+15551234567"


def test_dedupe_image_nodes_preserves_order() -> None:
    nodes = [
        extractor._ImageNode(src="https://example.com/logo.png", alt=None),
        extractor._ImageNode(src="https://example.com/logo.png", alt="Logo"),
        extractor._ImageNode(src="https://example.com/hero.jpg", alt=None),
    ]

    unique = extractor._dedupe_image_nodes(nodes)

    assert [node.src for node in unique] == [
        "https://example.com/logo.png",
        "https://example.com/hero.jpg",
    ]


def test_dedupe_fonts_by_url() -> None:
    fonts = [
        extractor.FontCandidate(
            url="https://cdn.com/font.woff", source="inline", stylesheet_url=None
        ),
        extractor.FontCandidate(
            url="https://cdn.com/font.woff", source="stylesheet", stylesheet_url="https://cdn.com/styles.css"
        ),
        extractor.FontCandidate(
            url="https://cdn.com/font2.woff", source="inline", stylesheet_url=None
        ),
    ]

    deduped = extractor._dedupe_fonts(fonts)

    assert [font.url for font in deduped] == [
        "https://cdn.com/font.woff",
        "https://cdn.com/font2.woff",
    ]
