from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.utils.websocket_manager import manager

router = APIRouter(prefix="/ws", tags=["WebSocket"])


@router.websocket("/{room}")
async def websocket_endpoint(
    websocket: WebSocket,
    room: str
):
    await manager.connect(websocket, room)
    
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(
                {"event": "echo", "message": data},
                room=room
            )
    except WebSocketDisconnect:
        manager.disconnect(websocket, room)