from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, model_serializer


class _BaseModel(BaseModel):
    model_config = ConfigDict(ser_json_exclude_none=True)


class ExtractionRequest(_BaseModel):
    url: HttpUrl = Field(..., description="URL of the webpage to extract content from")


class TextNode(_BaseModel):
    content: str = Field(..., description="Trimmed text content")


class ImageResource(_BaseModel):
    src: HttpUrl = Field(..., description="Absolute URL for the image")
    alt: str | None = Field(None, description="Alt text associated with the image")

    @model_serializer(mode="wrap")
    def serialize(self, handler):  # type: ignore[override]
        data = handler(self)
        if data.get("alt") is None:
            data.pop("alt", None)
        return data


class FontResource(_BaseModel):
    url: HttpUrl = Field(..., description="Absolute URL pointing to the font file")
    source: Literal["stylesheet", "inline"] = Field(
        ..., description="Origin of the font reference"
    )
    stylesheet_url: HttpUrl | None = Field(
        None, description="Stylesheet URL when the font was discovered in a linked CSS file"
    )


class NavigationItem(_BaseModel):
    title: str = Field(..., description="Display text for the navigation entry")
    href: str | None = Field(None, description="Absolute URL or action for the entry")
    children: list["NavigationItem"] = Field(
        default_factory=list, description="Nested navigation items"
    )


class ExtractionResponse(_BaseModel):
    url: HttpUrl
    title: str | None
    fetched_at: datetime
    text: list[TextNode]
    text_blob: str = Field(..., description="All visible text concatenated into a single blob")
    images: list[ImageResource]
    fonts: list[FontResource]
    navigation: list[NavigationItem] = Field(
        default_factory=list,
        description="Hierarchical navigation menu extracted from the page",
    )


NavigationItem.model_rebuild()
