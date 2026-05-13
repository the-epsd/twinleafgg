import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { ServerConfig, UserInfo } from 'ptcg-server';
import { useAuth } from '../context/AuthContext';
import { useCoreSession } from '../context/CoreSessionContext';
import { useSnackbar } from '../context/SnackbarContext';
import { resolveAvatarUrl } from '../utils/avatarUrl';
import { getFriendsList, getSentFriendRequests, sendFriendRequest } from '../api/friendsApi';
import { updateUserRole } from '../api/profileApi';
import { ApiError } from '../api/apiError';
import { CreateGameInviteDialog } from './CreateGameInviteDialog';
import { SelfPlayGameDialog } from './SelfPlayGameDialog';
import styles from './OnlinePlayersSidebar.module.css';

const MAX_ROWS = 20;

export interface OnlinePlayersSidebarProps {
  appearance?: 'light' | 'sandbox';
}

function otherFriendUserId(f: { user: UserInfo; friend: UserInfo }, myUserId: number): number {
  return f.user.userId === myUserId ? f.friend.userId : f.user.userId;
}

function onlineMenuKey(clientId: number): string {
  return `online-${clientId}`;
}

function friendMenuKey(userId: number): string {
  return `friend-${userId}`;
}

export function OnlinePlayersSidebar({ appearance = 'light' }: OnlinePlayersSidebarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, serverConfig } = useAuth();
  const { clients, usersById, clientId: myClientId } = useCoreSession();
  const { showSnackbar } = useSnackbar();

  const [friendUserIds, setFriendUserIds] = useState<Set<number>>(() => new Set());
  const [friendUsersFromApi, setFriendUsersFromApi] = useState<UserInfo[]>([]);
  const [pendingSentUserIds, setPendingSentUserIds] = useState<Set<number>>(() => new Set());
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);
  const [inviteClientId, setInviteClientId] = useState<number | null>(null);
  const [selfPlayOpen, setSelfPlayOpen] = useState(false);
  const [friendActionUserId, setFriendActionUserId] = useState<number | null>(null);

  const friendsHeaderId = `${useId()}-friends`;
  const onlineHeaderId = `${useId()}-online`;

  const displayFriends = useMemo(() => {
    const merged = friendUsersFromApi.map((u) => usersById[u.userId] ?? u);
    merged.sort((a, b) => a.name.localeCompare(b.name));
    return merged;
  }, [friendUsersFromApi, usersById]);

  const onlineRows = useMemo(() => {
    const list: { clientId: number; user: UserInfo }[] = [];
    for (const c of clients) {
      if (friendUserIds.has(c.userId)) {
        continue;
      }
      const u = usersById[c.userId];
      if (u) {
        list.push({ clientId: c.clientId, user: u });
      }
    }
    list.sort((a, b) => a.user.name.localeCompare(b.user.name));
    return list.slice(0, MAX_ROWS);
  }, [clients, usersById, friendUserIds]);

  const reloadFriends = useCallback(async () => {
    if (!user) {
      return;
    }
    try {
      const [fl, sent] = await Promise.all([getFriendsList(), getSentFriendRequests()]);
      const accepted = new Set<number>();
      const friendUsers: UserInfo[] = [];
      const seen = new Set<number>();
      for (const f of fl.friends) {
        if (f.status !== 'accepted') {
          continue;
        }
        const oid = otherFriendUserId(f, user.userId);
        accepted.add(oid);
        if (!seen.has(oid)) {
          seen.add(oid);
          const other = f.user.userId === oid ? f.user : f.friend;
          friendUsers.push(other);
        }
      }
      friendUsers.sort((a, b) => a.name.localeCompare(b.name));

      const pending = new Set<number>();
      for (const r of sent.requests) {
        if (r.status !== 'pending') {
          continue;
        }
        if (r.sender.userId === user.userId) {
          pending.add(r.receiver.userId);
        }
      }
      setFriendUserIds(accepted);
      setFriendUsersFromApi(friendUsers);
      setPendingSentUserIds(pending);
    } catch {
      /* ignore */
    }
  }, [user]);

  useEffect(() => {
    void reloadFriends();
  }, [reloadFriends]);

  useEffect(() => {
    if (openMenuKey == null) {
      return;
    }
    const menuKey = openMenuKey;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenMenuKey(null);
      }
    }
    function onPointerDown(e: MouseEvent | PointerEvent) {
      const el = document.querySelector(`[data-player-menu-root="${CSS.escape(menuKey)}"]`);
      if (el && !el.contains(e.target as Node)) {
        setOpenMenuKey(null);
      }
    }
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [openMenuKey]);

  const isAdmin = user?.roleId === 4;

  const onSendFriendRequest = useCallback(
    async (targetUserId: number) => {
      setFriendActionUserId(targetUserId);
      try {
        await sendFriendRequest(targetUserId);
        showSnackbar(t('REACT_FRIEND_REQUEST_SENT'));
        await reloadFriends();
      } catch (e) {
        showSnackbar(e instanceof ApiError ? e.message : t('REACT_FRIEND_REQUEST_FAILED'), { variant: 'error' });
      } finally {
        setFriendActionUserId(null);
      }
    },
    [reloadFriends, showSnackbar, t],
  );

  const onBanToggle = useCallback(
    async (targetUser: UserInfo) => {
      const banned = targetUser.roleId === 1;
      try {
        await updateUserRole(targetUser.userId, banned ? 2 : 1);
        showSnackbar(t(banned ? 'PROFILE_UNBAN_SUCCESS' : 'PROFILE_BAN_SUCCESS'));
      } catch (e) {
        showSnackbar(e instanceof ApiError ? e.message : t(banned ? 'PROFILE_UNBAN_ERROR' : 'PROFILE_BAN_ERROR'), {
          variant: 'error',
        });
      }
    },
    [showSnackbar, t],
  );

  const asideClass =
    appearance === 'sandbox' ? `${styles.aside} ${styles.asideSandbox}` : styles.aside;

  const menuClass =
    appearance === 'sandbox' ? `${styles.playerMenu} ${styles.playerMenuSandbox}` : styles.playerMenu;

  const headerClass =
    appearance === 'sandbox' ? `${styles.header} ${styles.headerSandbox}` : styles.header;

  const emptyClass =
    appearance === 'sandbox' ? `${styles.empty} ${styles.emptySandbox}` : styles.empty;

  const resolveFriendOnlineClientId = useCallback(
    (userId: number): number | null => {
      const hit = clients.find((c) => c.userId === userId);
      return hit ? hit.clientId : null;
    },
    [clients],
  );

  return (
    <aside className={asideClass} aria-label={t('REACT_SIDEBAR_FRIENDS_AND_ONLINE')}>
      <div className={styles.columnShell}>
        <section className={styles.sectionFriends} aria-labelledby={friendsHeaderId}>
          <div id={friendsHeaderId} className={headerClass}>
            <span>{t('REACT_FRIENDS_SECTION_TITLE')}</span>
            <span className={styles.count}>({displayFriends.length})</span>
          </div>
          {displayFriends.length === 0 ? (
            <p className={emptyClass}>{t('REACT_FRIENDS_SECTION_EMPTY')}</p>
          ) : (
            <ul className={styles.friendsList}>
              {displayFriends.map((fu) => {
                const cid = resolveFriendOnlineClientId(fu.userId);
                const mk = friendMenuKey(fu.userId);
                return (
                  <li key={fu.userId}>
                    <FriendPlayerRow
                      user={fu}
                      onlineClientId={cid}
                      appearance={appearance}
                      myClientId={myClientId}
                      menuOpen={openMenuKey === mk}
                      menuKey={mk}
                      onToggleMenu={() => setOpenMenuKey((cur) => (cur === mk ? null : mk))}
                      menuClass={menuClass}
                      isAdmin={isAdmin}
                      serverConfig={serverConfig}
                      navigate={navigate}
                      onCloseMenu={() => setOpenMenuKey(null)}
                      onInvite={() => {
                        if (cid != null) {
                          setInviteClientId(cid);
                        }
                        setOpenMenuKey(null);
                      }}
                      onBanToggle={() => void onBanToggle(fu)}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className={styles.sectionOnline} aria-labelledby={onlineHeaderId}>
          <div id={onlineHeaderId} className={headerClass}>
            <span>{t('REACT_ONLINE_PLAYERS_TITLE')}</span>
            <span className={styles.count}>({onlineRows.length})</span>
          </div>
          {onlineRows.length === 0 ? (
            <p className={emptyClass}>{t('REACT_ONLINE_PLAYERS_EMPTY')}</p>
          ) : (
            <ul className={styles.list}>
              {onlineRows.map((row) => {
                const mk = onlineMenuKey(row.clientId);
                return (
                  <li key={row.clientId}>
                    <OnlinePlayerRow
                      row={row}
                      appearance={appearance}
                      isSelf={user?.userId === row.user.userId}
                      myClientId={myClientId}
                      menuOpen={openMenuKey === mk}
                      menuKey={mk}
                      onToggleMenu={() => setOpenMenuKey((cur) => (cur === mk ? null : mk))}
                      menuClass={menuClass}
                      friendUserIds={friendUserIds}
                      pendingSentUserIds={pendingSentUserIds}
                      friendBusy={friendActionUserId === row.user.userId}
                      isAdmin={isAdmin}
                      serverConfig={serverConfig}
                      navigate={navigate}
                      onCloseMenu={() => setOpenMenuKey(null)}
                      onInvite={() => {
                        setInviteClientId(row.clientId);
                        setOpenMenuKey(null);
                      }}
                      onSelfPlay={() => {
                        setSelfPlayOpen(true);
                        setOpenMenuKey(null);
                      }}
                      onSendFriendRequest={() => void onSendFriendRequest(row.user.userId)}
                      onBanToggle={() => void onBanToggle(row.user)}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {inviteClientId != null ? (
        <CreateGameInviteDialog
          open
          invitedClientId={inviteClientId}
          onClose={() => setInviteClientId(null)}
        />
      ) : null}
      {selfPlayOpen ? <SelfPlayGameDialog open onClose={() => setSelfPlayOpen(false)} /> : null}
    </aside>
  );
}

type FriendPlayerRowProps = {
  user: UserInfo;
  onlineClientId: number | null;
  appearance: 'light' | 'sandbox';
  myClientId: number;
  menuOpen: boolean;
  menuKey: string;
  onToggleMenu: () => void;
  menuClass: string;
  isAdmin: boolean;
  serverConfig: ServerConfig | null;
  navigate: ReturnType<typeof useNavigate>;
  onCloseMenu: () => void;
  onInvite: () => void;
  onBanToggle: () => void;
};

function FriendPlayerRow({
  user: u,
  onlineClientId,
  appearance,
  myClientId,
  menuOpen,
  menuKey,
  onToggleMenu,
  menuClass,
  isAdmin,
  serverConfig,
  navigate,
  onCloseMenu,
  onInvite,
  onBanToggle,
}: FriendPlayerRowProps) {
  const { t } = useTranslation();
  const panelId = useId();

  const src = resolveAvatarUrl(u.avatarFile, serverConfig);
  const rowClass = `${styles.rowButton}${appearance === 'sandbox' ? ` ${styles.rowSandbox}` : ''}`;
  const avatarClass =
    appearance === 'sandbox' ? `${styles.avatar} ${styles.avatarSandbox}` : styles.avatar;

  const showInvite = onlineClientId != null && onlineClientId !== myClientId;

  return (
    <div className={styles.rowWrap} data-player-menu-root={menuKey}>
      <button
        type="button"
        className={`${styles.rowButton} ${rowClass}`}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        aria-controls={panelId}
        onClick={onToggleMenu}
      >
        <div className={styles.avatarWrap}>
          {src ? (
            <img className={avatarClass} src={src} alt="" />
          ) : (
            <div className={avatarClass} aria-hidden />
          )}
          {onlineClientId != null ? <span className={styles.dot} aria-hidden /> : null}
        </div>
        <div className={styles.meta}>
          <span className={appearance === 'sandbox' ? `${styles.name} ${styles.nameSandbox}` : styles.name}>
            {u.name}
          </span>
          <span className={appearance === 'sandbox' ? `${styles.rank} ${styles.rankSandbox}` : styles.rank}>
            {t('REACT_ONLINE_PLAYERS_RANK', { rank: u.ranking })}
          </span>
        </div>
        <span className={styles.rowChevron} aria-hidden>
          ▾
        </span>
      </button>

      {menuOpen ? (
        <ul id={panelId} className={menuClass} role="menu">
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className={styles.menuItem}
              onClick={() => {
                onCloseMenu();
                navigate(`/profile/${u.userId}`);
              }}
            >
              {t('BUTTON_SHOW_PROFILE')}
            </button>
          </li>
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className={styles.menuItem}
              onClick={() => {
                onCloseMenu();
                navigate(`/message/${u.userId}`);
              }}
            >
              {t('BUTTON_SEND_MESSAGE')}
            </button>
          </li>
          {showInvite ? (
            <li role="none">
              <button type="button" role="menuitem" className={styles.menuItem} onClick={onInvite}>
                {t('BUTTON_INVITE')}
              </button>
            </li>
          ) : null}
          {isAdmin ? (
            <li role="none">
              <button
                type="button"
                role="menuitem"
                className={`${styles.menuItem} ${u.roleId === 1 ? styles.menuItemWarn : styles.menuItemDanger}`}
                onClick={() => {
                  onCloseMenu();
                  onBanToggle();
                }}
              >
                {u.roleId === 1 ? t('PROFILE_UNBAN_USER') : t('PROFILE_BAN_USER')}
              </button>
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}

type OnlinePlayerRowProps = {
  row: { clientId: number; user: UserInfo };
  appearance: 'light' | 'sandbox';
  isSelf: boolean;
  myClientId: number;
  menuOpen: boolean;
  menuKey: string;
  onToggleMenu: () => void;
  menuClass: string;
  friendUserIds: Set<number>;
  pendingSentUserIds: Set<number>;
  friendBusy: boolean;
  isAdmin: boolean;
  serverConfig: ServerConfig | null;
  navigate: ReturnType<typeof useNavigate>;
  onCloseMenu: () => void;
  onInvite: () => void;
  onSelfPlay: () => void;
  onSendFriendRequest: () => void;
  onBanToggle: () => void;
};

function OnlinePlayerRow({
  row,
  appearance,
  isSelf,
  myClientId,
  menuOpen,
  menuKey,
  onToggleMenu,
  menuClass,
  friendUserIds,
  pendingSentUserIds,
  friendBusy,
  isAdmin,
  serverConfig,
  navigate,
  onCloseMenu,
  onInvite,
  onSelfPlay,
  onSendFriendRequest,
  onBanToggle,
}: OnlinePlayerRowProps) {
  const { t } = useTranslation();
  const panelId = useId();

  const u = row.user;
  const src = resolveAvatarUrl(u.avatarFile, serverConfig);
  const rowClass = `${styles.rowButton}${appearance === 'sandbox' ? ` ${styles.rowSandbox}` : ''}${isSelf ? ` ${styles.rowSelf}` : ''}`;
  const avatarClass =
    appearance === 'sandbox' ? `${styles.avatar} ${styles.avatarSandbox}` : styles.avatar;

  const isFriend = friendUserIds.has(u.userId);
  const requestPending = pendingSentUserIds.has(u.userId);
  const showInvite = !isSelf && row.clientId !== myClientId;

  return (
    <div className={styles.rowWrap} data-player-menu-root={menuKey}>
      <button
        type="button"
        className={`${styles.rowButton} ${rowClass}`}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        aria-controls={panelId}
        onClick={onToggleMenu}
      >
        <div className={styles.avatarWrap}>
          {src ? (
            <img className={avatarClass} src={src} alt="" />
          ) : (
            <div className={avatarClass} aria-hidden />
          )}
          <span className={styles.dot} aria-hidden />
        </div>
        <div className={styles.meta}>
          <span className={appearance === 'sandbox' ? `${styles.name} ${styles.nameSandbox}` : styles.name}>
            {u.name}
            {isSelf ? (
              <span className={appearance === 'sandbox' ? `${styles.you} ${styles.youSandbox}` : styles.you}>
                {t('REACT_ONLINE_PLAYERS_YOU')}
              </span>
            ) : null}
          </span>
          <span className={appearance === 'sandbox' ? `${styles.rank} ${styles.rankSandbox}` : styles.rank}>
            {t('REACT_ONLINE_PLAYERS_RANK', { rank: u.ranking })}
          </span>
        </div>
        <span className={styles.rowChevron} aria-hidden>
          ▾
        </span>
      </button>

      {menuOpen ? (
        <ul id={panelId} className={menuClass} role="menu">
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className={styles.menuItem}
              onClick={() => {
                onCloseMenu();
                navigate(`/profile/${u.userId}`);
              }}
            >
              {t('BUTTON_SHOW_PROFILE')}
            </button>
          </li>
          {!isSelf ? (
            <li role="none">
              <button
                type="button"
                role="menuitem"
                className={styles.menuItem}
                onClick={() => {
                  onCloseMenu();
                  navigate(`/message/${u.userId}`);
                }}
              >
                {t('BUTTON_SEND_MESSAGE')}
              </button>
            </li>
          ) : null}
          {isSelf ? (
            <li role="none">
              <button type="button" role="menuitem" className={styles.menuItem} onClick={onSelfPlay}>
                {t('REACT_MENU_SELF_PLAY')}
              </button>
            </li>
          ) : null}
          {!isSelf && showInvite ? (
            <li role="none">
              <button type="button" role="menuitem" className={styles.menuItem} onClick={onInvite}>
                {t('BUTTON_INVITE')}
              </button>
            </li>
          ) : null}
          {!isSelf ? (
            <li role="none">
              {isFriend ? (
                <button type="button" role="menuitem" className={styles.menuItem} disabled>
                  {t('REACT_FRIEND_STATUS_FRIENDS')}
                </button>
              ) : requestPending ? (
                <button type="button" role="menuitem" className={styles.menuItem} disabled>
                  {t('REACT_FRIEND_REQUEST_PENDING')}
                </button>
              ) : (
                <button
                  type="button"
                  role="menuitem"
                  className={styles.menuItem}
                  disabled={friendBusy}
                  onClick={() => {
                    onCloseMenu();
                    onSendFriendRequest();
                  }}
                >
                  {t('REACT_ADD_TO_FRIEND')}
                </button>
              )}
            </li>
          ) : null}
          {isAdmin && !isSelf ? (
            <li role="none">
              <button
                type="button"
                role="menuitem"
                className={`${styles.menuItem} ${u.roleId === 1 ? styles.menuItemWarn : styles.menuItemDanger}`}
                onClick={() => {
                  onCloseMenu();
                  onBanToggle();
                }}
              >
                {u.roleId === 1 ? t('PROFILE_UNBAN_USER') : t('PROFILE_BAN_USER')}
              </button>
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
