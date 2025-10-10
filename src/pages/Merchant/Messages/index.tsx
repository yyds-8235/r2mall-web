import React, { useState } from 'react';
import { Card, List, Avatar, Button, Empty } from 'antd';
import { UserOutlined, MessageOutlined } from '@ant-design/icons';
import ChatWindow from '@/components/ChatWindow';

interface MessageItem {
  userId: number;
  userName: string;
  lastMessage: string;
  time: string;
  unread: number;
}

const MerchantMessages: React.FC = () => {
  const [messages] = useState<MessageItem[]>([]);
  const [chatVisible, setChatVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string } | null>(null);

  const handleOpenChat = (userId: number, userName: string) => {
    setSelectedUser({ id: userId, name: userName });
    setChatVisible(true);
  };

  return (
    <div>
      <Card title="客服消息">
        {messages.length > 0 ? (
          <List
            dataSource={messages}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    icon={<MessageOutlined />}
                    onClick={() => handleOpenChat(item.userId, item.userName)}
                  >
                    回复
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={item.userName}
                  description={
                    <div>
                      <div>{item.lastMessage}</div>
                      <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>{item.time}</div>
                    </div>
                  }
                />
                {item.unread > 0 && (
                  <div style={{ color: '#f5222d' }}>
                    {item.unread} 条未读
                  </div>
                )}
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无消息" />
        )}
      </Card>

      {chatVisible && selectedUser && (
        <ChatWindow
          visible={chatVisible}
          onClose={() => setChatVisible(false)}
          toUserId={selectedUser.id}
          toUserName={selectedUser.name}
        />
      )}
    </div>
  );
};

export default MerchantMessages;

