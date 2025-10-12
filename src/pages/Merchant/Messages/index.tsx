import React, { useState, useEffect } from 'react';
import { Card, List, Avatar, Button, Empty, Spin, Tag } from 'antd';
import { UserOutlined, MessageOutlined } from '@ant-design/icons';
import { getChatSessions } from '@/apis/user';
import ChatWindow from '@/components/ChatWindow';
import { formatFullDateTime } from '@/utils/dateTime';

interface ChatSession {
  userId: number;
  userName: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  totalMessages: number;
}

const MerchantMessages: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    fetchChatSessions();
  }, []);

  const fetchChatSessions = async () => {
    setLoading(true);
    try {
      const res = await getChatSessions();
      setSessions(res.data);
    } catch (error) {
      console.error('获取聊天会话失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChat = (userId: number, userName: string) => {
    setSelectedUser({ id: userId, name: userName });
    setChatVisible(true);
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <Card title="客服消息">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px' }}>加载聊天会话中...</div>
            </div>
          ) : sessions.length > 0 ? (
            <List
              dataSource={sessions}
              renderItem={session => (
                <List.Item
                  style={{ 
                    cursor: 'pointer',
                    padding: '16px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    backgroundColor: session.unreadCount > 0 ? '#fff7e6' : '#fff'
                  }}
                  onClick={() => handleOpenChat(session.userId, session.userName)}
                >
                  <List.Item.Meta
                    avatar={session.avatar ? <Avatar src={session.avatar} /> : <Avatar icon={<UserOutlined />} />}
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{session.userName}</span>
                        {session.unreadCount > 0 && (
                          <Tag color="red">{session.unreadCount} 条未读</Tag>
                        )}
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: '#666',
                          marginBottom: '4px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {session.lastMessage}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#999',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span>{formatFullDateTime(session.lastMessageTime)}</span>
                          <span>共 {session.totalMessages} 条消息</span>
                        </div>
                      </div>
                    }
                  />
                  <Button
                    type="primary"
                    icon={<MessageOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenChat(session.userId, session.userName);
                    }}
                  >
                    查看聊天
                  </Button>
                </List.Item>
              )}
            />
          ) : (
            <Empty description="暂无聊天会话" />
          )}
        </Card>
      </div>

      {chatVisible && selectedUser && (
        <ChatWindow
          visible={chatVisible}
          onClose={() => {
            setChatVisible(false);
            setSelectedUser(null);
            // 关闭聊天窗口后刷新会话列表
            fetchChatSessions();
          }}
          toUserId={selectedUser.id}
          toUserName={selectedUser.name}
        />
      )}
      </div>
  );
};

export default MerchantMessages;

