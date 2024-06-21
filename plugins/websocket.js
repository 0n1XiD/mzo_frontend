class WebSocketService {

    static instance = null;
    callbacks = {};
    current_user = null;

    static getInstance(){
        if(!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance
    }

    constructor(){
        this.socketRef = null;
    }

    connect(chat_url, user){
        this.current_user = user
        const path = `ws://159.65.121.86:8002/ws/chat/${chat_url}/`;
        // const path = `ws://127.0.0.1:8000/ws/chat/${chat_url}/`;
        this.socketRef = new WebSocket(path)
        this.socketRef.onopen = () => {
            console.log('Соединение установлено')
            return 'oponed'
        };
        this.socketRef.onmessage = e => {
            this.socketNewMessage(e.data);
        }
        this.socketRef.onerror = e => {
            
        }
        this.socketRef.onclose = () => {
            // this.connect();
        }
    }

    disconnect() {
        try{
            this.socketRef.close();
        } catch {}
    }

    socketNewMessage(data) {
        const parsedData = JSON.parse(data);
        const command = parsedData.command;
        if(Object.keys(this.callbacks).length === 0) {
            return;
        }
        if(command === 'new_message' && this.current_user === parsedData.message.author) {
            this.callbacks[command](parsedData.message);
        } else if (command === 'new_message' && this.current_user != parsedData.message.author){
            this.callbacks['append_message'](parsedData.message);
        }
        if(command === 'messages') {
            this.callbacks[command](parsedData.messages);
        }
        if(command === 'chat_info') {
            this.callbacks[command](parsedData.chat_info);
        }
    }

    fetchMessages(email, chatId, newMessagesCount){
        this.sendMessage({ 
            command: 'fetch_messages', 
            email: email,
            chatId: chatId,
            newMessagesCount: newMessagesCount
        });
    }

    newChatMessage(message){
        this.sendMessage({ 
            command: 'new_message', 
            from: message.from, 
            message: message.content,
            chatId: message.chatId
        });
    }

    addCallbacks(newMessageCallback, messagesCallback, appendMessageCallback){
        this.callbacks['new_message'] = newMessageCallback;
        this.callbacks['messages'] = messagesCallback;
        this.callbacks['append_message'] = appendMessageCallback;
    }

    sendMessage(data) {
        try{
            this.socketRef.send(JSON.stringify({ ...data }))
        } catch (err) {
            console.log(err.message);
        }
    }

    state() {
        try{
            return this.socketRef.readyState;
        }
        catch{}
    }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;