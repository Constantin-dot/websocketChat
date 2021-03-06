import io from "socket.io-client";

export const api = {
    socket: null as null | SocketIOClient.Socket,
    createConnection() {
        // this.socket = io("http://localhost:3009")
        this.socket = io("https://konstantin-websocket-chat-back.herokuapp.com")
    },
    subscribe(initMessagesHandler: (messages: any, fn: () => void) => void,
              newMessagesSentHandler: (message: any) => void,
              userTypingHandler: (user: any) => void) {
        this.socket?.on('init-messages-published', initMessagesHandler)
        this.socket?.on('new-message-sent', newMessagesSentHandler)
        this.socket?.on('user-is-typing', userTypingHandler)
    },
    destroyConnection() {
        this.socket?.disconnect()
        this.socket = null
    },
    sendName(name: string) {
        this.socket?.emit('client-name-sent', name)
    },
    sendMessage(message: string){
        this.socket?.emit('client-message-sent', message, (error: string | null) => {
            if(error) alert(error)
        })
    },
    typeMessage() {
        this.socket?.emit('client-typed')
    },
    clientDeleteAllMessages() {
        this.socket?.emit('client-deleted-all-messages')
    }
}