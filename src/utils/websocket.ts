import type { ChatMessage } from '@/types';

class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string = '';
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 3000;
  private messageHandlers: ((message: ChatMessage) => void)[] = [];
  private connectionHandlers: (() => void)[] = [];
  private closeHandlers: (() => void)[] = [];

  // 连接WebSocket
  connect(fromRole: 'user' | 'merchant', toId: string | number) {
    this.url = `ws://localhost:8082/im/${fromRole}/${toId}`;
    
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket连接成功');
        this.reconnectAttempts = 0;
        this.connectionHandlers.forEach(handler => handler());
      };
      
      this.ws.onmessage = (event) => {
        try {
          const message: ChatMessage = JSON.parse(event.data);
          this.messageHandlers.forEach(handler => handler(message));
        } catch (error) {
          console.error('解析消息失败:', error);
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket错误:', error);
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket连接关闭');
        this.closeHandlers.forEach(handler => handler());
        
        // 尝试重连
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`尝试重连... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          setTimeout(() => {
            this.connect(fromRole, toId);
          }, this.reconnectDelay);
        }
      };
    } catch (error) {
      console.error('WebSocket连接失败:', error);
    }
  }

  // 发送消息
  sendMessage(message: ChatMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket未连接');
    }
  }

  // 监听消息
  onMessage(handler: (message: ChatMessage) => void) {
    this.messageHandlers.push(handler);
  }

  // 移除消息监听
  offMessage(handler: (message: ChatMessage) => void) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }

  // 监听连接
  onConnection(handler: () => void) {
    this.connectionHandlers.push(handler);
  }

  // 监听关闭
  onClose(handler: () => void) {
    this.closeHandlers.push(handler);
  }

  // 关闭连接
  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers = [];
    this.connectionHandlers = [];
    this.closeHandlers = [];
  }
}

export default new WebSocketClient();

