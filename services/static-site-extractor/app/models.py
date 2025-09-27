from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, HttpUrl


class ExtractionRequest(BaseModel):
    url: HttpUrl = Field(..., description="URL of the webpage to extract content from")


class TextNode(BaseModel):
    path: str = Field(..., description="CSS-like path to the element containing the text")
    content: str = Field(..., description="Trimmed text content")


class ImageResource(BaseModel):
    src: HttpUrl = Field(..., description="Absolute URL for the image")
    alt: str | None = Field(None, description="Alt text associated with the image")


class FontResource(BaseModel):
    url: HttpUrl = Field(..., description="Absolute URL pointing to the font file")
    source: Literal["stylesheet", "inline"] = Field(
        ..., description="Origin of the font reference"
    )
    stylesheet_url: HttpUrl | None = Field(
        None, description="Stylesheet URL when the font was discovered in a linked CSS file"
    )


class ExtractionResponse(BaseModel):
    url: HttpUrl
    title: str | None
    fetched_at: datetime
    text: list[TextNode]
    images: list[ImageResource]
    fonts: list[FontResource]
