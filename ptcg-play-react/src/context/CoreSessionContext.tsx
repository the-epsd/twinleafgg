import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { ClientInfo, CoreInfo, GameInfo, GameSettings, GameState, UserInfo } from 'ptcg-server';
import { isActiveListGameInfo } from '../game/isActiveListGameInfo';
import { getStoredToken } from '../api/storage';
import { useAuth } from './AuthContext';
import { getSocketManager } from '../socket/socketManager';
import { appConfig } from '../env/config';
import { ApiError } from '../api/apiError';
import type { ClientUserData } from './coreTypes';
import { ConnectionStatusSnackbar } from '../components/ConnectionStatusSnackbar';
import { InviteAwareness } from '../components/InviteAwareness';
import { isPlayerInGame } from '../games/myGamesClassify';
import { LoadingSessionScreen } from '../pages/auth/LoadingSessionScreen';

export type ConnectionBanner =
  | { type: 'reconnecting'; attempt: number }
  | { type: 'disconnected' }
  | { type: 'failed' }
  | null;

interface CoreSessionState {
  clientId: number;
  clients: ClientInfo[];
  usersById: Record<number, UserInfo>;
  games: GameInfo[];
  connected: boolean;
  error: string | null;
  connectionBanner: ConnectionBanner;
}

const initialCore: CoreSessionState = {
  clientId: 0,
  clients: [],
  usersById: {},
  games: [],
  connected: false,
  error: null,
  connectionBanner: null,
};

interface CoreSessionContextValue extends CoreSessionState {
  createGame: (
    deck: string[],
    gameSettings: GameSettings,
    invitedClientId?: number,
    deckId?: number,
    sleeveImagePath?: string
  ) => Promise<GameState>;
  createSelfPlayGame: (
    deck: string[],
    secondDeck: string[],
    gameSettings: GameSettings,
    deckId?: number,
    secondDeckId?: number,
    sleeveImagePath?: string,
    secondSleeveImagePath?: string
  ) => Promise<GameState>;
  joinMatchmaking: (
    format: import('ptcg-server').Format,
    deck: string[],
    artworks?: { code: string; artworkId?: number }[],
    deckId?: number,
    sleeveImagePath?: string,
    sandboxMode?: boolean
  ) => Promise<unknown>;
  leaveMatchmaking: () => Promise<unknown>;
}

const CoreSessionContext = createContext<CoreSessionContextValue | null>(null);

function mergeUsers(list: UserInfo[]): Record<number, UserInfo> {
  const m: Record<number, UserInfo> = {};
  for (const u of list) {
    m[u.userId] = u;
  }
  return m;
}

export function CoreSessionProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [core, setCore] = useState<CoreSessionState>(initialCore);
  const loggedUserIdRef = useRef(user?.userId ?? 0);
  const clientIdRef = useRef(0);
  const autoJoinedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    loggedUserIdRef.current = user?.userId ?? 0;
  }, [user?.userId]);

  useEffect(() => {
    const authToken = getStoredToken();
    if (!isAuthenticated || !authToken) {
      getSocketManager().disable();
      setCore(initialCore);
      autoJoinedRef.current.clear();
      clientIdRef.current = 0;
      return;
    }

    const socket = getSocketManager();
    let cancelled = false;
    let sessionReady = false;
    // Captured when listeners attach so teardown offs the same Manager instance.
    let manager: ReturnType<typeof getSocketManager>['raw']['io'] | undefined;

    const autoJoinGame = async (game: GameInfo, sessionClientId: number): Promise<void> => {
      if (autoJoinedRef.current.has(game.gameId)) {
        return;
      }
      const userId = loggedUserIdRef.current;
      // Seat owners (by clientId or userId) must rejoin so the server runs
      // handlePlayerReconnection after a drop. Observers join via TablePage.
      if (!isPlayerInGame(game, sessionClientId, userId)) {
        return;
      }
      autoJoinedRef.current.add(game.gameId);
      try {
        await socket.emit<{ gameId: number }, GameState>('game:rejoin', { gameId: game.gameId });
      } catch {
        // Not disconnected (or rejoin rejected) — fall back to a normal join.
        try {
          await socket.emit<number, GameState>('game:join', game.gameId);
        } catch {
          autoJoinedRef.current.delete(game.gameId);
        }
      }
    };

    const onJoin = (data: ClientUserData) => {
      setCore((c) => {
        const usersById = { ...c.usersById, [data.user.userId]: data.user };
        const clients = [...c.clients, { clientId: data.clientId, userId: data.user.userId }];
        return { ...c, usersById, clients };
      });
    };

    const onLeave = (clientId: number) => {
      setCore((c) => ({
        ...c,
        clients: c.clients.filter((x) => x.clientId !== clientId),
      }));
    };

    const onGameInfo = (game: GameInfo) => {
      setCore((c) => {
        if (!isActiveListGameInfo(game)) {
          autoJoinedRef.current.delete(game.gameId);
          return { ...c, games: c.games.filter((g) => g.gameId !== game.gameId) };
        }
        const games = c.games.slice();
        const i = games.findIndex((g) => g.gameId === game.gameId);
        if (i !== -1) {
          games[i] = game;
        } else {
          games.push(game);
        }
        return { ...c, games };
      });
      if (sessionReady) {
        void autoJoinGame(game, clientIdRef.current);
      }
    };

    const onUsersInfo = (infos: UserInfo[]) => {
      setCore((c) => {
        const usersById = { ...c.usersById };
        for (const u of infos) {
          usersById[u.userId] = u;
        }
        return { ...c, usersById };
      });
    };

    const onCreateGame = (game: GameInfo) => {
      setCore((c) => {
        if (!isActiveListGameInfo(game) || c.games.some((g) => g.gameId === game.gameId)) {
          return c;
        }
        return { ...c, games: [...c.games, game] };
      });
      if (sessionReady && isActiveListGameInfo(game)) {
        void autoJoinGame(game, clientIdRef.current);
      }
    };

    const onDeleteGame = (gameId: number) => {
      autoJoinedRef.current.delete(gameId);
      setCore((c) => ({
        ...c,
        games: c.games.filter((g) => g.gameId !== gameId),
      }));
    };

    const bindCoreListeners = () => {
      socket.on<ClientUserData>('core:join', onJoin);
      socket.on<number>('core:leave', onLeave);
      socket.on<GameInfo>('core:gameInfo', onGameInfo);
      socket.on<UserInfo[]>('core:usersInfo', onUsersInfo);
      socket.on<GameInfo>('core:createGame', onCreateGame);
      socket.on<number>('core:deleteGame', onDeleteGame);
    };

    const unbindCoreListeners = () => {
      socket.raw.off('core:join', onJoin);
      socket.raw.off('core:leave', onLeave);
      socket.raw.off('core:gameInfo', onGameInfo);
      socket.raw.off('core:usersInfo', onUsersInfo);
      socket.raw.off('core:createGame', onCreateGame);
      socket.raw.off('core:deleteGame', onDeleteGame);
    };

    async function refreshCoreInfo(options?: { rejoinGames?: boolean }): Promise<void> {
      const rejoinGames = options?.rejoinGames !== false;
      const info = await socket.emit<void, CoreInfo>('core:getInfo', undefined);
      if (cancelled) {
        return;
      }
      clientIdRef.current = info.clientId;
      const activeGames = info.games.filter(isActiveListGameInfo);
      if (rejoinGames) {
        // Join/rejoin before marking connected so TablePage doesn't attach with a
        // temporary post-reconnect clientId (seat restore may rewrite client.id).
        await Promise.all(activeGames.map((game) => autoJoinGame(game, info.clientId)));
        if (cancelled) {
          return;
        }
        const after = await socket.emit<void, CoreInfo>('core:getInfo', undefined);
        if (cancelled) {
          return;
        }
        clientIdRef.current = after.clientId;
        setCore({
          clientId: after.clientId,
          clients: after.clients,
          usersById: mergeUsers(after.users),
          games: after.games.filter(isActiveListGameInfo),
          connected: true,
          error: null,
          connectionBanner: null,
        });
        return;
      }
      setCore({
        clientId: info.clientId,
        clients: info.clients,
        usersById: mergeUsers(info.users),
        games: activeGames,
        connected: true,
        error: null,
        connectionBanner: null,
      });
    }

    async function restoreSessionAfterReconnect(): Promise<void> {
      await refreshCoreInfo({ rejoinGames: true });
    }

    const onDisconnect = (reason: string) => {
      if (cancelled || socket.wasIntentionalDisconnect || !sessionReady) {
        return;
      }
      // Allow post-reconnect refreshCoreInfo to rejoin games on the new socket session.
      autoJoinedRef.current.clear();
      // Server kicked us — socket.io will not auto-reconnect unless we call connect()
      if (reason === 'io server disconnect') {
        socket.markReconnecting();
        socket.raw.connect();
      } else {
        socket.markReconnecting();
      }
      setCore((c) => ({
        ...c,
        connected: false,
        connectionBanner: { type: 'reconnecting', attempt: 1 },
      }));
    };

    const onReconnectAttempt = (attempt: number) => {
      if (cancelled || !sessionReady) {
        return;
      }
      setCore((c) => ({
        ...c,
        connected: false,
        connectionBanner: { type: 'reconnecting', attempt },
      }));
    };

    // Socket.IO v4: Manager emits reconnect*; Socket emits connect on both first
    // connect and successful reconnect (including manual connect after server kick).
    const onSocketReconnect = () => {
      if (cancelled || !sessionReady) {
        return;
      }
      socket.clearReconnectingQuery();
      void restoreSessionAfterReconnect().catch((e) => {
        if (cancelled) {
          return;
        }
        const msg = e instanceof ApiError ? e.message : String(e);
        setCore((c) => ({
          ...c,
          connected: false,
          error: msg,
          connectionBanner: { type: 'failed' },
        }));
      });
    };

    const onReconnectFailed = () => {
      if (cancelled || !sessionReady) {
        return;
      }
      setCore((c) => ({
        ...c,
        connected: false,
        connectionBanner: { type: 'failed' },
      }));
    };

    const onConnectError = () => {
      if (cancelled || socket.wasIntentionalDisconnect) {
        return;
      }
      if (!sessionReady) {
        return;
      }
      setCore((c) => ({
        ...c,
        connected: false,
        connectionBanner: c.connectionBanner?.type === 'reconnecting'
          ? c.connectionBanner
          : { type: 'disconnected' },
      }));
    };

    async function connect() {
      const t = getStoredToken();
      if (!t) {
        return;
      }
      try {
        socket.setServerUrl(appConfig.apiUrl);
        socket.enable(t);
        await socket.waitConnected();
        if (cancelled) {
          return;
        }
        await refreshCoreInfo();
        if (cancelled) {
          return;
        }
        sessionReady = true;
        bindCoreListeners();

        // Attach after first connect so Socket `connect` only runs for restores.
        manager = socket.raw.io;
        socket.raw.on('disconnect', onDisconnect);
        socket.raw.on('connect', onSocketReconnect);
        socket.raw.on('connect_error', onConnectError);
        manager.on('reconnect_attempt', onReconnectAttempt);
        manager.on('reconnect_failed', onReconnectFailed);
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof ApiError ? e.message : String(e);
          setCore((c) => ({
            ...c,
            connected: false,
            error: msg,
            connectionBanner: null,
          }));
        }
      }
    }

    void connect();

    return () => {
      cancelled = true;
      sessionReady = false;
      unbindCoreListeners();
      socket.raw.off('disconnect', onDisconnect);
      socket.raw.off('connect', onSocketReconnect);
      socket.raw.off('connect_error', onConnectError);
      manager?.off('reconnect_attempt', onReconnectAttempt);
      manager?.off('reconnect_failed', onReconnectFailed);
    };
  }, [isAuthenticated]);

  const createGame = useCallback(
    async (
      deck: string[],
      gameSettings: GameSettings,
      invitedClientId?: number,
      deckId?: number,
      sleeveImagePath?: string
    ) => {
      const socket = getSocketManager();
      return socket.emit<
        {
          deck: string[];
          gameSettings: GameSettings;
          clientId?: number;
          deckId?: number;
          sleeveImagePath?: string;
        },
        GameState
      >('core:createGame', {
        deck,
        gameSettings,
        clientId: invitedClientId,
        deckId,
        sleeveImagePath,
      });
    },
    []
  );

  const joinMatchmaking = useCallback(
    async (
      format: import('ptcg-server').Format,
      deck: string[],
      artworks?: { code: string; artworkId?: number }[],
      deckId?: number,
      sleeveImagePath?: string,
      sandboxMode?: boolean
    ) => {
      const socket = getSocketManager();
      return socket.emit('matchmaking:join', {
        format,
        deck,
        artworks,
        deckId,
        sleeveImagePath,
        ...(sandboxMode === true ? { sandboxMode: true } : {}),
      });
    },
    []
  );

  const leaveMatchmaking = useCallback(async () => {
    const socket = getSocketManager();
    return socket.emit('matchmaking:leave', undefined);
  }, []);

  const createSelfPlayGame = useCallback(
    async (
      deck: string[],
      secondDeck: string[],
      gameSettings: GameSettings,
      deckId?: number,
      secondDeckId?: number,
      sleeveImagePath?: string,
      secondSleeveImagePath?: string
    ) => {
      const socket = getSocketManager();
      return socket.emit<
        {
          deck: string[];
          secondDeck: string[];
          gameSettings: GameSettings;
          deckId?: number;
          secondDeckId?: number;
          sleeveImagePath?: string;
          secondSleeveImagePath?: string;
        },
        GameState
      >('core:createSelfPlayGame', {
        deck,
        secondDeck,
        gameSettings,
        deckId,
        secondDeckId,
        sleeveImagePath,
        secondSleeveImagePath,
      });
    },
    []
  );

  const value = useMemo<CoreSessionContextValue>(
    () => ({
      ...core,
      createGame,
      createSelfPlayGame,
      joinMatchmaking,
      leaveMatchmaking,
    }),
    [core, createGame, createSelfPlayGame, joinMatchmaking, leaveMatchmaking]
  );

  // Keep the auth-style loading screen up through the first socket connect so
  // pages never flash a brief "Connecting…" alert between auth-ready and online.
  const awaitingInitialConnect =
    !core.connected && core.error == null && core.connectionBanner == null;

  return (
    <CoreSessionContext.Provider value={value}>
      {awaitingInitialConnect ? <LoadingSessionScreen /> : children}
      <ConnectionStatusSnackbar />
      <InviteAwareness />
    </CoreSessionContext.Provider>
  );
}

export function useCoreSession(): CoreSessionContextValue {
  const ctx = useContext(CoreSessionContext);
  if (!ctx) {
    throw new Error('useCoreSession must be used within CoreSessionProvider');
  }
  return ctx;
}
