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
import { getStoredToken } from '../api/storage';
import { useAuth } from './AuthContext';
import { getSocketManager } from '../socket/socketManager';
import { appConfig } from '../env/config';
import { ApiError } from '../api/apiError';
import type { ClientUserData } from './coreTypes';

interface CoreSessionState {
  clientId: number;
  clients: ClientInfo[];
  usersById: Record<number, UserInfo>;
  games: GameInfo[];
  connected: boolean;
  error: string | null;
}

const initialCore: CoreSessionState = {
  clientId: 0,
  clients: [],
  usersById: {},
  games: [],
  connected: false,
  error: null,
};

interface CoreSessionContextValue extends CoreSessionState {
  createGame: (
    deck: string[],
    gameSettings: GameSettings,
    invitedClientId?: number,
    deckId?: number,
    sleeveImagePath?: string
  ) => Promise<GameState>;
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
      setCore(initialCore);
      return;
    }

    const socket = getSocketManager();
    let cancelled = false;

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
        if (c.games.some((g) => g.gameId === game.gameId)) {
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
        const info = await socket.emit<void, CoreInfo>('core:getInfo', undefined);
        if (cancelled) {
          return;
        }
        setCore({
          clientId: info.clientId,
          clients: info.clients,
          usersById: mergeUsers(info.users),
          games: info.games,
          connected: true,
          error: null,
        });

        socket.on<ClientUserData>('core:join', onJoin);
        socket.on<number>('core:leave', onLeave);
        socket.on<GameInfo>('core:gameInfo', onGameInfo);
        socket.on<UserInfo[]>('core:usersInfo', onUsersInfo);
        socket.on<GameInfo>('core:createGame', onCreateGame);
        socket.on<number>('core:deleteGame', onDeleteGame);
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof ApiError ? e.message : String(e);
          setCore((c) => ({ ...c, connected: false, error: msg }));
        }
      }
    }

    void connect();

    return () => {
      cancelled = true;
      socket.raw.off('core:join', onJoin);
      socket.raw.off('core:leave', onLeave);
      socket.raw.off('core:gameInfo', onGameInfo);
      socket.raw.off('core:usersInfo', onUsersInfo);
      socket.raw.off('core:createGame', onCreateGame);
      socket.raw.off('core:deleteGame', onDeleteGame);
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

  const value = useMemo<CoreSessionContextValue>(
    () => ({
      ...core,
      createGame,
    }),
    [core, createGame]
  );

  return <CoreSessionContext.Provider value={value}>{children}</CoreSessionContext.Provider>;
}

export function useCoreSession(): CoreSessionContextValue {
  const ctx = useContext(CoreSessionContext);
  if (!ctx) {
    throw new Error('useCoreSession must be used within CoreSessionProvider');
  }
  return ctx;
}
