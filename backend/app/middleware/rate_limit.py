from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from collections import defaultdict, deque
import time

class RateLimitMiddleware(BaseHTTPMiddleware):
    
    def __init__(self, app, requests_per_minute: int = 60):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.requests = defaultdict(deque)
    
    async def dispatch(self, request: Request, call_next):
        if request.url.path.startswith("/ws"):
            return await call_next(request)
        
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        
        while self.requests[client_ip] and self.requests[client_ip][0] < now - 60:
            self.requests[client_ip].popleft()
        
        if len(self.requests[client_ip]) >= self.requests_per_minute:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Trop de requêtes, veuillez réessayer plus tard"
            )
        
        self.requests[client_ip].append(now)
        
        return await call_next(request)