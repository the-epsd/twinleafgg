import { io, type Socket } from 'socket.io-client';
import { Format, GameSettings, type ClientInfo, type CoreInfo, type GameInfo, type GameState, type UserInfo } from 'ptcg-server';
import type { GameCommandApi } from '../lib/game/gameApi';
import type { EngineResponse, GameView, LogView } from '../lib/game/types';
import { RemoteCommandApi } from '../lib/game/remoteCommandApi';
import { configuredServerUrl } from '../lib/game/serverConfig';
import { applyCardsInfoToSerializer, gameStateToGameView } from '../lib/game/serverGameView';
import { gameStore } from './game.svelte';
import { gameSessionStore } from './gameSession.svelte';

type LoginResponse = {
  ok?: boolean;
  token?: string;
  user?: UserInfo;
  error?: string;
};

type CardsResponse = {
  ok?: boolean;
  cardsInfo?: import('ptcg-server').CardsInfo;
  error?: string;
};

type SocketAck<R> = {
  message: string;
  data?: R;
};

export type PlayMode = 'local' | 'remote';

class RemoteSessionStore {
  mode = $state<PlayMode>('local');
  displayName = $state('Player');
  serverUrl = $state(configuredServerUrl());
  connected = $state(false);
  connecting = $state(false);
  busy = $state(false);
  error = $state('');
  token = $state('');
  user = $state<UserInfo | null>(null);
  clientId = $state(0);
  clients = $state<ClientInfo[]>([]);
  usersById = $state<Record<number, UserInfo>>({});
  games = $state<GameInfo[]>([]);
  activeGameId = $state<number | null>(null);
  playerIndex = $state<number | null>(null);

  readonly api: GameCommandApi = new RemoteCommandApi(this);

  private socket: Socket | null = null;
  private unregisterGameEvents: (() => void) | null = null;

  get baseUrl(): string {
    const configured = this.serverUrl.trim().replace(/\/$/, '');
    if (configured) {
      return configured;
    }
    return typeof window === 'undefined' ? '' : window.location.origin;
  }

  get opponents() {
    return this.clients
      .filter((client) => client.clientId !== this.clientId)
      .map((client) => ({ clientId: client.clientId, user: this.usersById[client.userId] }))
      .filter((item): item is { clientId: number; user: UserInfo } => !!item.user);
  }

  get myGames() {
    const userId = this.user?.userId;
    if (!userId || !this.clientId) {
      return [];
    }
    return this.games.filter((game) => (
      game.clientIds?.includes(this.clientId)
      || game.playerUserIds?.includes(userId)
    ));
  }

  setMode(mode: PlayMode) {
    this.mode = mode;
    this.error = '';
  }

  async connect(): Promise<void> {
    if (this.connecting) {
      return;
    }
    this.connecting = true;
    this.error = '';
    try {
      await this.loadCards();
      const login = await this.loginGuest();
      if (!login.token || !login.user) {
        throw new Error(login.error || 'Unable to sign in.');
      }
      this.token = login.token;
      this.user = login.user;
      await this.connectSocket(login.token);
      this.connected = true;
    } catch (error) {
      this.connected = false;
      this.error = errorMessage(error);
      this.disconnect();
    } finally {
      this.connecting = false;
    }
  }

  disconnect(): void {
    this.unregisterGameEvents?.();
    this.unregisterGameEvents = null;
    this.socket?.disconnect();
    this.socket = null;
    this.connected = false;
    this.clientId = 0;
    this.clients = [];
    this.usersById = {};
    this.games = [];
    this.activeGameId = null;
    this.playerIndex = null;
  }

  async invite(clientId: number, deck: string[]): Promise<EngineResponse> {
    if (!this.connected || !this.socket) {
      return this.failure('Not connected.');
    }
    this.busy = true;
    try {
      const settings = new GameSettings();
      settings.format = Format.STANDARD;
      const gameState = await this.emit<
        { deck: string[]; gameSettings: GameSettings; clientId: number },
        GameState
      >('core:createGame', {
        deck,
        gameSettings: settings,
        clientId,
      });
      this.startGameFromState(gameState);
      return this.currentResponse();
    } catch (error) {
      return this.failure(errorMessage(error));
    } finally {
      this.busy = false;
    }
  }

  async joinGame(gameId: number): Promise<EngineResponse> {
    if (!this.connected || !this.socket) {
      return this.failure('Not connected.');
    }
    this.busy = true;
    try {
      const gameState = await this.emit<number, GameState>('game:join', gameId);
      this.startGameFromState(gameState);
      return this.currentResponse();
    } catch (error) {
      return this.failure(errorMessage(error));
    } finally {
      this.busy = false;
    }
  }

  async emitGameAction(event: string, data: Record<string, unknown>): Promise<EngineResponse> {
    if (!this.connected || !this.socket || this.activeGameId === null) {
      return this.failure('No remote game is active.');
    }
    this.busy = true;
    try {
      await this.emit(event, { gameId: this.activeGameId, ...data });
      return this.currentResponse();
    } catch (error) {
      return this.failure(errorMessage(error));
    } finally {
      this.busy = false;
    }
  }

  leaveActiveGame(): void {
    this.unregisterGameEvents?.();
    this.unregisterGameEvents = null;
    this.activeGameId = null;
    this.playerIndex = null;
  }

  private async loadCards(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v1/cards/all`);
    const data = (await response.json()) as CardsResponse;
    if (!response.ok || !data.ok || !data.cardsInfo) {
      throw new Error(data.error || 'Unable to load cards from server.');
    }
    applyCardsInfoToSerializer(data.cardsInfo);
  }

  private async loginGuest(): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/v1/login/guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: this.displayName }),
    });
    const data = (await response.json()) as LoginResponse;
    if (!response.ok || !data.ok) {
      throw new Error(data.error || 'Guest login failed.');
    }
    return data;
  }

  private async connectSocket(token: string): Promise<void> {
    this.socket?.disconnect();
    const socket = io(this.baseUrl, {
      autoConnect: false,
      reconnection: false,
      transports: ['websocket'],
      timeout: 20_000,
      query: { token },
    });
    this.socket = socket;
    this.registerCoreEvents(socket);
    socket.connect();
    await this.waitConnected(socket);
    const info = await this.emit<void, CoreInfo>('core:getInfo', undefined);
    this.applyCoreInfo(info);
  }

  private registerCoreEvents(socket: Socket): void {
    socket.on('core:join', (data: { clientId: number; user: UserInfo }) => {
      this.usersById = { ...this.usersById, [data.user.userId]: data.user };
      const next = { clientId: data.clientId, userId: data.user.userId };
      this.clients = this.clients.some((client) => client.clientId === data.clientId)
        ? this.clients.map((client) => (client.clientId === data.clientId ? next : client))
        : [...this.clients, next];
    });
    socket.on('core:leave', (clientId: number) => {
      this.clients = this.clients.filter((client) => client.clientId !== clientId);
    });
    socket.on('core:usersInfo', (users: UserInfo[]) => {
      const usersById = { ...this.usersById };
      for (const user of users) {
        usersById[user.userId] = user;
      }
      this.usersById = usersById;
    });
    socket.on('core:createGame', (game: GameInfo) => this.upsertGame(game));
    socket.on('core:gameInfo', (game: GameInfo) => this.upsertGame(game));
    socket.on('core:deleteGame', (gameId: number) => {
      this.games = this.games.filter((game) => game.gameId !== gameId);
    });
    socket.on('disconnect', () => {
      this.connected = false;
    });
  }

  private registerGameEvents(gameId: number): void {
    this.unregisterGameEvents?.();
    if (!this.socket) {
      return;
    }
    const socket = this.socket;
    const onStateChange = (data: { stateData: string; playerStats?: unknown[] }) => {
      const previousLogs = gameStore.game?.logs ?? [];
      const view = gameStateToGameView({ stateData: data.stateData }, this.clientId, previousLogs);
      this.applyView(view);
    };
    socket.on(`game[${gameId}]:stateChange`, onStateChange);
    this.unregisterGameEvents = () => {
      socket.off(`game[${gameId}]:stateChange`, onStateChange);
    };
  }

  private startGameFromState(gameState: GameState): void {
    this.activeGameId = gameState.gameId;
    this.registerGameEvents(gameState.gameId);
    this.applyView(gameStateToGameView(gameState, this.clientId));
  }

  private applyView(view: GameView): void {
    const playerIndex = view.players.findIndex((player) => player.id === this.clientId);
    this.playerIndex = playerIndex === -1 ? null : playerIndex;
    gameStore.apply({ ok: true, view });
    gameSessionStore.syncExternalUpdate();
  }

  private applyCoreInfo(info: CoreInfo): void {
    this.clientId = info.clientId;
    this.clients = info.clients;
    this.usersById = Object.fromEntries(info.users.map((user) => [user.userId, user]));
    this.games = info.games;
  }

  private upsertGame(game: GameInfo): void {
    this.games = this.games.some((item) => item.gameId === game.gameId)
      ? this.games.map((item) => (item.gameId === game.gameId ? game : item))
      : [...this.games, game];
  }

  private waitConnected(socket: Socket): Promise<void> {
    if (socket.connected) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        socket.off('connect', onConnect);
        socket.off('connect_error', onError);
        reject(new Error('Socket connect timeout.'));
      }, 20_000);
      const onConnect = () => {
        clearTimeout(timeout);
        socket.off('connect', onConnect);
        socket.off('connect_error', onError);
        resolve();
      };
      const onError = (error: Error) => {
        clearTimeout(timeout);
        socket.off('connect', onConnect);
        socket.off('connect_error', onError);
        reject(error);
      };
      socket.once('connect', onConnect);
      socket.once('connect_error', onError);
    });
  }

  private emit<T, R>(event: string, data?: T): Promise<R> {
    if (!this.socket) {
      return Promise.reject(new Error('Socket is not connected.'));
    }
    return new Promise((resolve, reject) => {
      this.socket!.emit(event, data, (response: SocketAck<R>) => {
        if (!response || response.message !== 'ok') {
          reject(new Error(socketAckErrorMessage(response?.data, response?.message ?? 'Socket error.')));
          return;
        }
        resolve(response.data as R);
      });
    });
  }

  private currentResponse(): EngineResponse {
    return gameStore.game ? { ok: true, view: gameStore.game } : this.failure('No game state received.');
  }

  private failure(error: string): EngineResponse {
    this.error = error;
    return gameStore.game ? { ok: false, error, view: gameStore.game } : { ok: false, error };
  }
}

function socketAckErrorMessage(data: unknown, fallback: string): string {
  if (data == null || data === '') {
    return fallback;
  }
  if (typeof data === 'string') {
    return data;
  }
  if (typeof data === 'number' || typeof data === 'boolean') {
    return String(data);
  }
  if (data instanceof Error) {
    return data.message;
  }
  return stringifyUnknown(data, fallback);
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return stringifyUnknown(error, 'Unknown error.');
}

function stringifyUnknown(value: unknown, fallback: string): string {
  if (value == null || value === '') {
    return fallback;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}

export const remoteSessionStore = new RemoteSessionStore();
