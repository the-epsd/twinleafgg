import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { socketService } from '../../services/socket.service';
import { ApiError } from '../../services/api.error';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface UserInfo {
  userId: number;
  username: string;
  avatar: string;
}

interface MessageRequest {
  userId: number;
}

interface SendMessageRequest {
  content: string;
  userId: number;
}

const MessagesComponent: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const [messageData, userData] = await Promise.all([
          socketService.emit<MessageRequest, Message[]>('messages:get', { userId: parseInt(userId!) }),
          socketService.emit<MessageRequest, UserInfo>('user:get', { userId: parseInt(userId!) })
        ]);
        setMessages(messageData);
        setUser(userData);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError('Failed to load messages');
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMessages();
    }
  }, [userId]);

  useEffect(() => {
    // Subscribe to new messages
    const messageSubscription = socketService.on<Message>('messages:new', (message) => {
      if (message.senderId === parseInt(userId!) || message.receiverId === parseInt(userId!)) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
    });

    return () => {
      socketService.off('messages:new');
    };
  }, [userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    try {
      const message = await socketService.emit<SendMessageRequest, Message>(
        'messages:send',
        { content: newMessage, userId: parseInt(userId) }
      );
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Error sending message:', error.message);
      }
    }
  };

  if (loading) {
    return <div>Loading messages...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="messages-container">
      <div className="messages-header">
        <img
          src={user.avatar || '/default-avatar.png'}
          alt={`${user.username}'s avatar`}
          className="user-avatar"
        />
        <h2>Conversation with {user.username}</h2>
      </div>

      <div className="messages-list">
        {messages.map(message => (
          <div
            key={message.id}
            className={`message ${message.senderId === parseInt(userId!) ? 'sent' : 'received'}`}
          >
            <div className="message-content">
              {message.content}
            </div>
            <div className="message-timestamp">
              {new Date(message.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" disabled={!newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default MessagesComponent; 