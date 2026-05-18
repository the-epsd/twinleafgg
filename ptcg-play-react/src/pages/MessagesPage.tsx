import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import type { MessageInfo, UserInfo } from 'ptcg-server';
import type { ConversationInfo } from 'ptcg-server';
import { getMessages } from '../api/messagesApi';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessagesContext';
import { ApiError } from '../api/apiError';

function getPeerId(c: ConversationInfo, me: number): number {
  return c.user1Id === me ? c.user2Id : c.user1Id;
}

function sanitizeMessageText(text: string): string {
  return (text || '')
    .trim()
    .split('')
    .filter((ch) => {
      const c = ch.charCodeAt(0);
      return (c >= 32 && c <= 126) || c === 9 || c === 10 || c === 13;
    })
    .join('');
}

export function MessagesPage() {
  const { t } = useTranslation();
  const { userId: userIdParam } = useParams();
  const navigate = useNavigate();
  const parsed = userIdParam ? parseInt(userIdParam, 10) : 0;
  const peerId = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  const { user } = useAuth();
  const loggedUserId = user?.userId ?? 0;

  const {
    conversations,
    messageUsers,
    sendMessage,
    readMessages,
    deleteConversation,
    loading: listLoading,
    error: listError,
  } = useMessages();

  const [messages, setMessages] = useState<MessageInfo[]>([]);
  const [extraUsers, setExtraUsers] = useState<Record<number, UserInfo>>({});
  const [threadLoading, setThreadLoading] = useState(false);
  const [threadError, setThreadError] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

  const displayUser = useCallback(
    (uid: number) => {
      if (uid === loggedUserId) {
        return user?.name ?? t('MESSAGES_YOU');
      }
      return messageUsers[uid]?.name ?? extraUsers[uid]?.name ?? t('MESSAGES_USER_FALLBACK', { id: uid });
    },
    [loggedUserId, user?.name, messageUsers, extraUsers, t]
  );

  const loadThread = useCallback(
    async (uid: number) => {
      if (!uid || !loggedUserId) {
        setMessages([]);
        return;
      }
      setThreadLoading(true);
      setThreadError(null);
      try {
        const res = await getMessages(uid);
        setMessages([...res.messages].reverse());
        const map: Record<number, UserInfo> = {};
        for (const u of res.users) {
          map[u.userId] = u;
        }
        setExtraUsers((prev) => ({ ...prev, ...map }));

        const unreadFromPeer = res.messages.some((m) => m.senderId === uid && !m.isRead);
        if (unreadFromPeer) {
          void readMessages(uid).catch(() => {});
        }
      } catch (e) {
        setThreadError(e instanceof ApiError ? e.message : t('MESSAGES_THREAD_LOAD_FAILED'));
        setMessages([]);
      } finally {
        setThreadLoading(false);
      }
    },
    [loggedUserId, readMessages, t]
  );

  useEffect(() => {
    if (!peerId || !loggedUserId) {
      setMessages([]);
      return;
    }
    void loadThread(peerId);
  }, [peerId, loggedUserId, loadThread]);

  const firstPeer =
    conversations.length > 0 ? getPeerId(conversations[0], loggedUserId) : 0;

  if (loggedUserId && !peerId && conversations.length > 0 && firstPeer) {
    return <Navigate to={`/message/${firstPeer}`} replace />;
  }

  async function onSend() {
    const text = sanitizeMessageText(draft);
    if (!text || !peerId || sending) {
      return;
    }
    setSending(true);
    setThreadError(null);
    try {
      const ack = await sendMessage(peerId, text);
      setDraft('');
      setMessages((prev) => [...prev, ack.message]);
    } catch (e) {
      setThreadError(e instanceof ApiError ? e.message : t('MESSAGES_SEND_FAILED'));
    } finally {
      setSending(false);
    }
  }

  async function onDelete(peer: number) {
    if (!peer || !window.confirm(t('MESSAGES_DELETE_CONVERSATION_CONFIRM'))) {
      return;
    }
    try {
      await deleteConversation(peer);
      setMessages([]);
      if (peerId === peer) {
        navigate('/message', { replace: true });
      }
    } catch (e) {
      setThreadError(e instanceof ApiError ? e.message : t('MESSAGES_DELETE_FAILED'));
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void onSend();
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        minHeight: 0,
        gap: 16,
        alignItems: 'stretch',
        width: '100%',
        maxWidth: 960,
        margin: '0 auto',
      }}
    >
      <aside style={{ width: 280, flexShrink: 0, borderRight: '1px solid #ddd', paddingRight: 12, overflowY: 'auto' }}>
        <h2 style={{ marginTop: 0 }}>{t('MESSAGES_CONVERSATIONS_ASIDE')}</h2>
        {listError && <p style={{ color: 'crimson', fontSize: 14 }}>{listError}</p>}
        {listLoading && <p>{t('MESSAGES_LOADING_LIST')}</p>}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {conversations.map((c) => {
            const pid = getPeerId(c, loggedUserId);
            const active = pid === peerId;
            return (
              <li key={`${c.user1Id}-${c.user2Id}`} style={{ marginBottom: 8 }}>
                <Link
                  to={`/message/${pid}`}
                  style={{
                    fontWeight: active ? 700 : 400,
                    display: 'block',
                    padding: 8,
                    background: active ? '#e8f4ff' : '#f5f5f5',
                    borderRadius: 4,
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  {displayUser(pid)}
                  {c.lastMessage && !c.lastMessage.isRead && c.lastMessage.senderId === pid && (
                    <span style={{ color: 'crimson', marginLeft: 6 }}>●</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      <section style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {!peerId ? (
          <p>{t('MESSAGES_HINT_SELECT')}</p>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <h1 style={{ margin: 0 }}>{displayUser(peerId)}</h1>
              <button type="button" onClick={() => void onDelete(peerId)}>
                {t('MESSAGES_DELETE_CONVERSATION')}
              </button>
            </div>
            {threadError && <p style={{ color: 'crimson' }}>{threadError}</p>}
            {threadLoading ? (
              <p>{t('MESSAGES_LOADING_THREAD')}</p>
            ) : (
            <div
              style={{
                flex: 1,
                minHeight: 180,
                border: '1px solid #ddd',
                borderRadius: 4,
                padding: 12,
                overflowY: 'auto',
                marginBottom: 12,
                background: '#fafafa',
              }}
            >
                {messages.map((m) => (
                  <div
                    key={m.messageId}
                    style={{
                      marginBottom: 8,
                      textAlign: m.senderId === loggedUserId ? 'right' : 'left',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: m.senderId === loggedUserId ? '#0b57d0' : '#e0e0e0',
                        color: m.senderId === loggedUserId ? '#fff' : '#111',
                        maxWidth: '85%',
                        wordBreak: 'break-word',
                      }}
                    >
                      {m.text}
                    </span>
                    <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>
                      {new Date(m.created).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'flex-end' }}>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                rows={3}
                placeholder={t('MESSAGES_PLACEHOLDER_COMPOSER')}
                style={{
                  flex: 1,
                  resize: 'vertical',
                  minHeight: 72,
                  maxHeight: 200,
                  fontFamily: 'inherit',
                  fontSize: 14,
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: '1px solid #ccc',
                }}
              />
              <button type="button" disabled={sending} onClick={() => void onSend()}>
                {t('MESSAGES_SEND_MESSAGE')}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
