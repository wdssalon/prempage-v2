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
