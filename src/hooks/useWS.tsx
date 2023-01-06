import { ApiActions, Message, KeyActions, PresentationActions } from '../types'

type ConnectionHandlerFunction = (value: boolean) => void
type ConnectionHandler = { fn: ConnectionHandlerFunction, id: string }

class WS {
  private ws: WebSocket | {} = {};

  connected = false;

  private connectionHandlers: Array<ConnectionHandler> = [];

  addConnectionHandler = (id: string, connectionHandler: ConnectionHandlerFunction) => {
    const index = this.connectionHandlers.findIndex((ch)=>ch.id===id)
    if (index < 0) {
      this.connectionHandlers.push({id:id, fn:connectionHandler})
      connectionHandler(this.connected)
    }
  }

  removeConnectionHandler = (id: string) => {
    const index = this.connectionHandlers.findIndex((ch) => ch.id === id)
    if (index > 0) {
      this.connectionHandlers.splice(index, 1)
    }
  }

  private executeConnectionHandlers = (value: boolean) => {
    this.connectionHandlers.forEach((connectionHandler) => {
      connectionHandler.fn(value)
    })
  }

  connect = (url: string) => {
    if (this.ws instanceof WebSocket) this.ws.close()
    const newWS = new WebSocket(url)
    this.ws = newWS
    this.setEvents(newWS)
  }
  disconnect = () => {
    if (this.ws instanceof WebSocket) {
      this.ws.close()
    }
  }
  setEvents = (ws: WebSocket) => {
    ws.onopen = () => {
      this.connected = true
      this.executeConnectionHandlers(true)
    }
    ws.onclose = () => {
      this.connected = false
      this.executeConnectionHandlers(false)
    }
    ws.onmessage = (e) => {
      console.log("mensaje", e)
    }
  }
  sendKeyCommand = (command: KeyActions) => {
    if (this.ws instanceof WebSocket) {
      if (this.ws.readyState === WebSocket.OPEN) {
        const message: Message = {
          event: ApiActions.KEYACTION,
          body: {
            keypress: command
          }
        }
        return this.ws.send(JSON.stringify(message))
      }
    }
    alert("no conectado")
  }
  sendPresentationCommand = (command: PresentationActions) => {
    if (this.ws instanceof WebSocket) {
      if (this.ws.readyState === WebSocket.OPEN) {
        const message: Message = {
          event: ApiActions.PRESENTATIONACTION,
          body: {
            action: command
          }
        }
        console.log("enviando comando")
        return this.ws.send(JSON.stringify(message))
      }
    }
    alert("no conectado")
  }
}

export default new WS()