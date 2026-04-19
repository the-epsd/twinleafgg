import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ConversationInfo, MessageInfo, UserInfo } from 'ptcg-server';
import { useAuth } from './AuthContext';
import { deleteMessages, getConversations } from '../api/messagesApi';
import i18n from '../i18n/i18n';
import { getSocketManager } from '../socket/socketManager';
import type { MessageSendAck } from '../types/responses';

function mergeUsers(into: Record<number, UserInfo>, users: UserInfo[]): Record<number, UserInfo> {
  const next = { ...into };
  for (const u of users) {
    next[u.userId] = u;
  }
  return next;
}

function mergeConversations(prev: ConversationInfo[], updates: ConversationInfo[]): ConversationInfo[] {
  let next = prev.slice();
  for (const c of updates) {
    const i = next.findIndex(
      (co) =>
        (co.user1Id === c.user1Id && co.user2Id === c.user2Id) ||
        (co.user1Id === c.user2Id && co.user2Id === c.user1Id)
    );
    if (i !== -1) {
      next[i] = c;
    } else {
      next = [c, ...next];
    }
  }
  return next;
}

interface MessagesContextValue {
  conversations: ConversationInfo[];
  messageUsers: Record<number, UserInfo>;
  loading: boolean;
  error: string | null;
  refreshConversations: () => Promise<void>;
  sendMessage: (userId: number, text: string) => Promise<MessageSendAck>;
  readMessages: (userId: number) => Promise<void>;
  deleteConversation: (userId: number) => Promise<void>;
  patchConversationLocal: (c: ConversationInfo) => void;
}

const MessagesContext = createContext<MessagesContextValue | null>(null);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const loggedUserId = user?.userId ?? 0;

  const [conversations, setConversations] = useState<ConversationInfo[]>([]);
  const [messageUsers, setMessageUsers] = useState<Record<number, UserInfo>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshConversations = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getConversations();
      setConversations(res.conversations);
      setMessageUsers((prev) => mergeUsers(prev, res.users));
    } catch (e) {
      setError(e instanceof Error ? e.message : i18n.t('MESSAGES_FAILED_LOAD'));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !loggedUserId) {
      setConversations([]);
      setMessageUsers({});
      setError(null);
      setLoading(false);
      return;
    }

    const socket = getSocketManager();
    let cancelled = false;

    const onReceived = (data: { message: MessageInfo; user: UserInfo }) => {
      const { message, user: u } = data;
      const senderId = message.senderId;
      setConversations((prev) => {
        let conversation = prev.find(
          (c) =>
            (c.user1Id === loggedUserId && c.user2Id === senderId) ||
            (c.user1Id === senderId && c.user2Id === loggedUserId)
        );
        if (conversation === undefined) {
          conversation = {
            user1Id: senderId,
            user2Id: loggedUserId,
            lastMessage: message,
          };
        } else {
          conversation = { ...conversation, lastMessage: message };
        }
        return mergeConversations(prev, [conversation]);
      });
      setMessageUsers((prev) => ({ ...prev, [u.userId]: u }));
    };

    const onRead = (data: { user: UserInfo }) => {
      const peerId = data.user.userId;
      setConversations((prev) => {
        const c = prev.find(
          (x) =>
            (x.user1Id === loggedUserId && x.user2Id === peerId) ||
            (x.user1Id === peerId && x.user2Id === loggedUserId)
        );
        if (!c) {
          return prev;
        }
        const lastMessage = { ...c.lastMessage, isRead: true };
        return mergeConversations(prev, [{ ...c, lastMessage }]);
      });
      setMessageUsers((prev) => ({ ...prev, [data.user.userId]: data.user }));
    };

    async function boot() {
      setLoading(true);
      setError(null);
      try {
        const res = await getConversations();
        if (cancelled) {
          return;
        }
        setConversations(res.conversations);
        setMessageUsers((prev) => mergeUsers(prev, res.users));
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : i18n.t('MESSAGES_FAILED_LOAD'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }

      if (cancelled) {
        return;
      }

      try {
        await socket.waitConnected();
        if (cancelled) {
          return;
        }
        socket.raw.on('message:received', onReceived);
        socket.raw.on('message:read', onRead);
      } catch {
        // Realtime unavailable; conversation list was already loaded via HTTP.
      }
    }

    void boot();

    return () => {
      cancelled = true;
      socket.raw.off('message:received', onReceived);
      socket.raw.off('message:read', onRead);
    };
  }, [isAuthenticated, loggedUserId]);

  const sendMessage = useCallback(async (userId: number, text: string) => {
    const sm = getSocketManager();
    return sm.emit<{ userId: number; text: string }, MessageSendAck>('message:send', { userId, text });
  }, []);

  const readMessages = useCallback(async (userId: number) => {
    const sm = getSocketManager();
    await sm.emit<{ userId: number }, void>('message:read', { userId });
  }, []);

  const deleteConversation = useCallback(async (userId: number) => {
    await deleteMessages(userId);
    setConversations((prev) => prev.filter((c) => c.user1Id !== userId && c.user2Id !== userId));
  }, []);

  const patchConversationLocal = useCallback((c: ConversationInfo) => {
    setConversations((prev) => mergeConversations(prev, [c]));
  }, []);

  const value = useMemo<MessagesContextValue>(
    () => ({
      conversations,
      messageUsers,
      loading,
      error,
      refreshConversations,
      sendMessage,
      readMessages,
      deleteConversation,
      patchConversationLocal,
    }),
    [
      conversations,
      messageUsers,
      loading,
      error,
      refreshConversations,
      sendMessage,
      readMessages,
      deleteConversation,
      patchConversationLocal,
    ]
  );

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

export function useMessages(): MessagesContextValue {
  const ctx = useContext(MessagesContext);
  if (!ctx) {
    throw new Error('useMessages must be used within MessagesProvider');
  }
  return ctx;
}
