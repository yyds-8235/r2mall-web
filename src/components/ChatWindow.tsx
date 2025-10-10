import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input, Button, List, Avatar, message as antMessage } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import type { ChatMessage } from '@/types';
import websocketClient from '@/utils/websocket';

interface ChatWindowProps {
  visible: boolean;
  onClose: () => void;
  toUserId: string | number;
  toUserName: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ visible, onClose, toUserId, toUserName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userInfo, role } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (visible && userInfo && role) {
      // 连接WebSocket
      websocketClient.connect(role, toUserId);

      // 监听消息
      const handleMessage = (message: ChatMessage) => {
        setMessages(prev => [...prev, message]);
      };

      websocketClient.onMessage(handleMessage);

      return () => {
        websocketClient.offMessage(handleMessage);
      };
    }
  }, [visible, toUserId, userInfo, role]);

  useEffect(() => {
    // 滚动到底部
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) {
      antMessage.warning('请输入消息内容');
      return;
    }

    if (!userInfo) {
      antMessage.error('未登录');
      return;
    }

    const message: ChatMessage = {
      fromUserId: String(userInfo.id),
      toUserId: String(toUserId),
      messageType: 'text',
      content: inputValue,
      timestamp: Date.now()
    };

    websocketClient.sendMessage(message);
    setMessages(prev => [...prev, message]);
    setInputValue('');
  };

  const handleClose = () => {
    websocketClient.close();
    setMessages([]);
    onClose();
  };

  return (
    <Modal
      title={`与 ${toUserName} 的对话`}
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={600}
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
          <List
            dataSource={messages}
            renderItem={(item) => {
              const isSelf = String(item.fromUserId) === String(userInfo?.id);
              return (
                <List.Item
                  style={{
                    justifyContent: isSelf ? 'flex-end' : 'flex-start',
                    border: 'none',
                    padding: '8px 0'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: isSelf ? 'row-reverse' : 'row',
                      alignItems: 'flex-start',
                      maxWidth: '70%'
                    }}
                  >
                    <Avatar
                      icon={<UserOutlined />}
                      style={{ margin: isSelf ? '0 0 0 8px' : '0 8px 0 0' }}
                    />
                    <div
                      style={{
                        backgroundColor: isSelf ? '#1890ff' : '#f0f0f0',
                        color: isSelf ? '#fff' : '#000',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        wordBreak: 'break-word'
                      }}
                    >
                      {item.content}
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
          <div ref={messagesEndRef} />
        </div>
        <div style={{ display: 'flex', gap: '8px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={handleSend}
            placeholder="输入消息..."
          />
          <Button type="primary" icon={<SendOutlined />} onClick={handleSend}>
            发送
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ChatWindow;

