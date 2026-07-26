import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
  const { isAuthenticated } = useAuth();
  const [core, setCore] = useState<CoreSessionState>(initialCore);

  useEffect(() => {
    const authToken = getStoredToken();
    if (!isAuthenticated || !authToken) {
      getSocketManager().disable();
      setCore(initialCore);
      return;
    }

    const socket = getSocketManager();
    let cancelled = false;
    let sessionReady = false;

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
    };

    const onDeleteGame = (gameId: number) => {
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

    async function refreshCoreInfo(): Promise<void> {
      const info = await socket.emit<void, CoreInfo>('core:getInfo', undefined);
      if (cancelled) {
        return;
      }
      setCore({
        clientId: info.clientId,
        clients: info.clients,
        usersById: mergeUsers(info.users),
        games: info.games.filter(isActiveListGameInfo),
        connected: true,
        error: null,
        connectionBanner: null,
      });
    }

    const onDisconnect = (reason: string) => {
      if (cancelled || socket.wasIntentionalDisconnect || !sessionReady) {
        return;
      }
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

    const onReconnect = () => {
      if (cancelled || !sessionReady) {
        return;
      }
      socket.clearReconnectingQuery();
      void refreshCoreInfo().catch((e) => {
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

        socket.raw.on('disconnect', onDisconnect);
        socket.raw.on('reconnect_attempt', onReconnectAttempt);
        socket.raw.on('reconnect', onReconnect);
        socket.raw.on('reconnect_failed', onReconnectFailed);
        socket.raw.on('connect_error', onConnectError);
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
      socket.raw.off('reconnect_attempt', onReconnectAttempt);
      socket.raw.off('reconnect', onReconnect);
      socket.raw.off('reconnect_failed', onReconnectFailed);
      socket.raw.off('connect_error', onConnectError);
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

  return (
    <CoreSessionContext.Provider value={value}>
      {children}
      <ConnectionStatusSnackbar />
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
