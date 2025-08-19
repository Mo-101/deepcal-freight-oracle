import asyncio
import json
from typing import Any, Dict, List

from fastapi import APIRouter
from fastapi.responses import StreamingResponse


class MCPServer:
    """Simple server for pushing real-time training updates via SSE."""

    def __init__(self) -> None:
        self.listeners: Dict[str, List[asyncio.Queue[str]]] = {}

    def register(self, job_id: str) -> asyncio.Queue[str]:
        queue: asyncio.Queue[str] = asyncio.Queue()
        self.listeners.setdefault(job_id, []).append(queue)
        return queue

    def disconnect(self, job_id: str, queue: asyncio.Queue[str]) -> None:
        listeners = self.listeners.get(job_id)
        if listeners and queue in listeners:
            listeners.remove(queue)

    async def push_update(self, job_id: str, data: Dict[str, Any]) -> None:
        listeners = self.listeners.get(job_id, [])
        payload = json.dumps(data)
        for q in list(listeners):
            await q.put(payload)


mcp_server = MCPServer()
router = APIRouter()


@router.get('/training/stream/{job_id}')
async def stream_training(job_id: str):
    """Server-sent events stream for training progress."""
    queue = mcp_server.register(job_id)

    async def event_generator():
        try:
            while True:
                data = await queue.get()
                yield f'data: {data}\n\n'
        except asyncio.CancelledError:
            pass
        finally:
            mcp_server.disconnect(job_id, queue)

    return StreamingResponse(event_generator(), media_type='text/event-stream')
