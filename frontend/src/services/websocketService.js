class WebSocketService {
  constructor() {
    this.socket = null
    this.listeners = {}
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
  }

  connect(room, token) {
    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8000'}/ws/${room}`
    
    this.socket = new WebSocket(wsUrl)
    
    this.socket.onopen = () => {
      console.log(`✅ WebSocket connecté à la room: ${room}`)
      this.reconnectAttempts = 0
      if (token) {
        this.socket.send(JSON.stringify({ type: 'auth', token }))
      }
    }

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (this.listeners[data.event]) {
          this.listeners[data.event](data)
        }
      } catch (error) {
        console.error('Erreur parsing WebSocket message:', error)
      }
    }

    this.socket.onclose = () => {
      console.log(`❌ WebSocket déconnecté de la room: ${room}`)
      this._attemptReconnect(room, token)
    }

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  _attemptReconnect(room, token) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * this.reconnectAttempts
      console.log(`🔄 Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts} dans ${delay}ms...`)
      
      setTimeout(() => {
        this.connect(room, token)
      }, delay)
    } else {
      console.error('❌ Échec de reconnexion WebSocket après plusieurs tentatives')
    }
  }

  on(event, callback) {
    this.listeners[event] = callback
  }

  off(event) {
    delete this.listeners[event]
  }

  send(message) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
    this.listeners = {}
  }
}

export default new WebSocketService()