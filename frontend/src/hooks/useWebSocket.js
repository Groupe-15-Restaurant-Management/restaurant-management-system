import { useState, useEffect, useRef } from 'react';

const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connecté');
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket déconnecté');
    };

    ws.onmessage = (event) => {
      setLastMessage(JSON.parse(event.data));
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = (message) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return { isConnected, lastMessage, sendMessage };
};

export default useWebSocket;