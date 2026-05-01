from typing import Dict, List, Optional
from fastapi import WebSocket

class ConnectionManager:
    
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.user_rooms: Dict[str, str] = {}
    
    async def connect(self, websocket: WebSocket, room: str, user_id: Optional[str] = None):
        await websocket.accept()
        if room not in self.active_connections:
            self.active_connections[room] = []
        self.active_connections[room].append(websocket)
        if user_id:
            self.user_rooms[user_id] = room
    
    def disconnect(self, websocket: WebSocket, room: str, user_id: Optional[str] = None):
        if room in self.active_connections and websocket in self.active_connections[room]:
            self.active_connections[room].remove(websocket)
            if not self.active_connections[room]:
                del self.active_connections[room]
        if user_id and user_id in self.user_rooms:
            del self.user_rooms[user_id]
    
    async def send_personal_message(self, message: dict, room: str):
        if room in self.active_connections:
            connections = self.active_connections[room][:]
            for connection in connections:
                try:
                    await connection.send_json(message)
                except Exception:
                    self.disconnect(connection, room)
    
    async def broadcast(self, message: dict):
        all_connections = []
        for room_connections in self.active_connections.values():
            all_connections.extend(room_connections)
        
        for connection in all_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass
    
    async def notify_kitchen(self, commande_id: int):
        await self.send_personal_message(
            {"event": "new_order", "order_id": commande_id},
            room="kitchen"
        )
    
    async def notify_delivery(self, livraison_id: int, livreur_id: int):
        await self.send_personal_message(
            {"event": "delivery_updated", "delivery_id": livraison_id},
            room=f"delivery_{livreur_id}"
        )

manager = ConnectionManager()