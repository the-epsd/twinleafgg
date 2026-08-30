import { useEffect, useState, useCallback, useRef, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import type { MessageInfo, UserInfo } from 'ptcg-server';
import type { ConversationInfo } from 'ptcg-server';
import { getMessages } from '../api/messagesApi';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessagesContext';
import { ApiError } from '../api/apiError';
import { Avatar } from '../components/Avatar';
import { cn } from '../utils/cn';
import { playSfx } from '../sfx';
import styles from './MessagesPage.module.css';

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

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const date = new Date(timestamp);

  if (diff < 60_000) {
    return 'now';
  }
  if (diff < 3_600_000) {
    return `${Math.floor(diff / 60_000)}m`;
  }
  if (diff < 86_400_000) {
    return `${Math.floor(diff / 3_600_000)}h`;
  }
  if (diff < 604_800_000) {
    return `${Math.floor(diff / 86_400_000)}d`;
  }
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function MessagesPage() {
  const { t } = useTranslation();
  const { userId: userIdParam } = useParams();
  const navigate = useNavigate();
  const parsed = userIdParam ? parseInt(userIdParam, 10) : 0;
  const peerId = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  const { user } = useAuth();
  const loggedUserId = user?.userId ?? 0;
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const resolveUser = useCallback(
    (uid: number): UserInfo | undefined => {
      if (uid === loggedUserId) {
        return user ?? undefined;
      }
      return messageUsers[uid] ?? extraUsers[uid];
    },
    [loggedUserId, user, messageUsers, extraUsers],
  );

  const displayName = useCallback(
    (uid: number) => {
      if (uid === loggedUserId) {
        return user?.name ?? t('MESSAGES_YOU');
      }
      return resolveUser(uid)?.name ?? t('MESSAGES_USER_FALLBACK', { id: uid });
    },
    [loggedUserId, user?.name, resolveUser, t],
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
    [loggedUserId, readMessages, t],
  );

  useEffect(() => {
    if (!peerId || !loggedUserId) {
      setMessages([]);
      return;
    }
    void loadThread(peerId);
  }, [peerId, loggedUserId, loadThread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, threadLoading, peerId]);

  const firstPeer = conversations.length > 0 ? getPeerId(conversations[0], loggedUserId) : 0;

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
    playSfx('uiButton');
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

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void onSend();
    }
  }

  const peerUser = peerId ? resolveUser(peerId) : undefined;
  const canSend = !!sanitizeMessageText(draft) && !sending && !threadLoading;

  return (
    <div className={styles.screen}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>{t('MESSAGES_TITLE')}</h2>
          </div>

          {listError ? <p className={styles.listAlert}>{listError}</p> : null}
          {listLoading ? <p className={styles.listStatus}>{t('MESSAGES_LOADING_LIST')}</p> : null}

          <ul className={styles.conversationList}>
            {conversations.map((c) => {
              const pid = getPeerId(c, loggedUserId);
              const active = pid === peerId;
              const peer = resolveUser(pid);
              const unread =
                !!c.lastMessage && !c.lastMessage.isRead && c.lastMessage.senderId === pid;
              return (
                <li key={`${c.user1Id}-${c.user2Id}`}>
                  <Link
                    to={`/message/${pid}`}
                    className={cn(
                      styles.contact,
                      active && styles.contactActive,
                      unread && styles.contactUnread,
                    )}
                    onClick={() => playSfx('uiNavslide')}
                  >
                    <div className={styles.avatarWrap}>
                      <Avatar
                        avatarFile={peer?.avatarFile}
                        className={styles.contactAvatar}
                        alt={displayName(pid)}
                      />
                      {unread ? <span className={styles.unreadDot} aria-hidden /> : null}
                    </div>
                    <div className={styles.contactBody}>
                      <div className={styles.contactTop}>
                        <p className={styles.contactName}>{displayName(pid)}</p>
                        {c.lastMessage?.created ? (
                          <span className={styles.contactTime}>
                            {formatTimestamp(c.lastMessage.created)}
                          </span>
                        ) : null}
                      </div>
                      <p className={styles.contactPreview}>{c.lastMessage?.text || ' '}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className={styles.main}>
          {!peerId ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyCard}>
                <div className={styles.emptyIcon} aria-hidden>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
                  </svg>
                </div>
                <p className={styles.emptyText}>{t('MESSAGES_NO_CONVERSATION_SELECTED')}</p>
              </div>
            </div>
          ) : (
            <div className={styles.thread}>
              <header className={styles.threadHeader}>
                <h1 className={styles.threadTitle}>{displayName(peerId)}</h1>
                <button type="button" className={styles.deleteBtn} onClick={() => void onDelete(peerId)}>
                  {t('MESSAGES_DELETE_CONVERSATION')}
                </button>
              </header>

              {threadError ? <p className={styles.threadAlert}>{threadError}</p> : null}

              <div className={styles.messages}>
                {threadLoading ? (
                  <p className={styles.threadLoading}>{t('MESSAGES_LOADING_THREAD')}</p>
                ) : (
                  messages.map((m) => {
                    const mine = m.senderId === loggedUserId;
                    const sender = resolveUser(m.senderId);
                    return (
                      <div
                        key={m.messageId}
                        className={cn(styles.entry, mine && styles.entryMine)}
                      >
                        {!mine ? (
                          <Avatar
                            avatarFile={sender?.avatarFile ?? peerUser?.avatarFile}
                            className={styles.messageAvatar}
                            alt={displayName(m.senderId)}
                          />
                        ) : null}
                        <div className={styles.entryBody}>
                          {!mine ? (
                            <div className={styles.entryMeta}>
                              <Link className={styles.senderLink} to={`/profile/${m.senderId}`}>
                                {displayName(m.senderId)}
                              </Link>
                              <span className={styles.timestamp}>{formatTimestamp(m.created)}</span>
                            </div>
                          ) : null}
                          <div className={cn(styles.bubble, mine && styles.bubbleMine)}>
                            <p className={styles.bubbleText}>{m.text}</p>
                            {mine ? (
                              <div
                                className={cn(styles.readMark, m.isRead && styles.readMarkRead)}
                                aria-hidden
                              >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                              </div>
                            ) : null}
                          </div>
                          {mine ? (
                            <div className={styles.entryMeta}>
                              <span className={styles.timestamp}>{formatTimestamp(m.created)}</span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className={styles.composer}>
                <div className={styles.composerRow}>
                  <textarea
                    className={styles.composerInput}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={onKeyDown}
                    rows={1}
                    maxLength={2048}
                    disabled={threadLoading}
                    placeholder={t('MESSAGES_ENTER_MESSAGE')}
                    aria-label={t('MESSAGES_ENTER_MESSAGE')}
                  />
                  <button
                    type="button"
                    className={styles.sendBtn}
                    disabled={!canSend}
                    onClick={() => void onSend()}
                    aria-label={t('MESSAGES_SEND_MESSAGE')}
                    title={t('MESSAGES_SEND_MESSAGE')}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
