"""Routes for managing Horizon section library operations."""
from __future__ import annotations

import asyncio
import json
from dataclasses import asdict
from typing import Any, Literal

from fastapi import APIRouter, HTTPException, Request, status
from starlette.concurrency import run_in_threadpool

from sse_starlette.sse import EventSourceResponse

from app.templates.horizon.models import (
    HorizonSectionInsertRequest,
    HorizonSectionInsertResponse,
)
from app.templates.horizon.sections import (
    HorizonSectionInsertionError,
    HorizonSectionLibraryService,
)


router = APIRouter(prefix="/projects/{project_slug}/sections", tags=["sections"])


@router.post(
    "/insert",
    response_model=HorizonSectionInsertResponse,
    status_code=status.HTTP_201_CREATED,
)
def insert_section(
    project_slug: str,
    payload: HorizonSectionInsertRequest,
) -> HorizonSectionInsertResponse:
    """Clone a Horizon section into the specified project workspace."""

    service = HorizonSectionLibraryService()
    slot = service.resolve_slot(payload.position, payload.target_section_id)
    result = service.insert_section_by_slot(
        site_slug=project_slug,
        section_key=payload.section_key,
        slot=slot,
        custom_prompt=payload.custom_section_prompt,
    )

    return HorizonSectionInsertResponse(**result.__dict__)


@router.get(
    "/insert/stream",
    status_code=status.HTTP_200_OK,
    response_model=None,
)
async def stream_insert_section(
    request: Request,
    project_slug: str,
    position: Literal["start", "end", "before", "after"],
    section_key: str,
    target_section_id: str | None = None,
    custom_section_prompt: str | None = None,
) -> EventSourceResponse:
    """Stream generation progress events while inserting a Horizon section."""

    service = HorizonSectionLibraryService()
    try:
        slot = service.resolve_slot(position, target_section_id)
    except HorizonSectionInsertionError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc

    loop = asyncio.get_running_loop()
    event_queue: asyncio.Queue[dict[str, Any]] = asyncio.Queue()
    finished = asyncio.Event()

    def emit_event(event_name: str, payload: dict[str, Any]) -> None:
        loop.call_soon_threadsafe(
            event_queue.put_nowait,
            {"event": event_name, "data": json.dumps(payload)},
        )

    def handle_progress(stage: Literal["generating", "validating"]) -> None:
        emit_event("stage", {"stage": stage})

    async def run_insertion() -> None:
        try:
            result = await run_in_threadpool(
                service.insert_section_by_slot,
                site_slug=project_slug,
                section_key=section_key,
                slot=slot,
                custom_prompt=custom_section_prompt,
                progress_callback=handle_progress,
            )
        except HorizonSectionInsertionError as exc:
            emit_event("stage", {"stage": "error"})
            emit_event("failed", {"message": exc.detail})
        except Exception:  # pragma: no cover - unforeseen errors
            emit_event("stage", {"stage": "error"})
            emit_event("failed", {"message": "Section insertion failed."})
        else:
            emit_event("stage", {"stage": "complete"})
            emit_event("completed", {"result": asdict(result)})
        finally:
            loop.call_soon_threadsafe(finished.set)

    task = asyncio.create_task(run_insertion())

    async def event_publisher():
        emit_event("stage", {"stage": "generating"})
        while True:
            if await request.is_disconnected():
                task.cancel()
                break

            if finished.is_set() and event_queue.empty():
                break

            try:
                payload = await asyncio.wait_for(event_queue.get(), timeout=0.25)
            except asyncio.TimeoutError:
                continue

            yield payload

        await asyncio.gather(task, return_exceptions=True)

    return EventSourceResponse(event_publisher())


__all__ = ["router"]
