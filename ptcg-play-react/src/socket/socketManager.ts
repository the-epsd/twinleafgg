import { io, type Socket } from 'socket.io-client';
import { ApiErrorEnum } from 'ptcg-server';
import { appConfig } from '../env/config';
import { ApiError } from '../api/apiError';

interface SocketAck<R> {
  message: string;
  data?: R;
}

const SOCKET_IO_OPTIONS = {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 10_000,
  transports: ['websocket'] as string[],
  timeout: 20_000,
};

function normalizeSocketBaseUrl(url: string): string {
  return url.replace(/\/$/, '');
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
  if (typeof data === 'object' && 'message' in data) {
    const m = (data as { message: unknown }).message;
    if (typeof m === 'string') {
      return m;
    }
  }
  try {
    return JSON.stringify(data);
  } catch {
    return fallback;
  }
}

export class PtcgSocketManager {
  private socket: Socket;
  private enabled = false;
  /** True while we intentionally disconnect (logout / server switch) so UI won't treat it as a drop. */
  private intentionalDisconnect = false;
  /** Normalized base URL for the current `this.socket` instance. */
  private activeBaseUrl: string;

  constructor() {
    this.activeBaseUrl = normalizeSocketBaseUrl(appConfig.apiUrl);
    this.socket = io(this.activeBaseUrl, {
      ...SOCKET_IO_OPTIONS,
      query: {},
    });
  }

  setServerUrl(url: string): void {
    const next = normalizeSocketBaseUrl(url);
    if (next === this.activeBaseUrl) {
      return;
    }
    this.activeBaseUrl = next;
    if (this.enabled) {
      this.disable();
    }
    this.intentionalDisconnect = true;
    this.socket.disconnect();
    this.socket = io(next, {
      ...SOCKET_IO_OPTIONS,
      query: {},
    });
    this.intentionalDisconnect = false;
  }

  enable(authToken: string): void {
    this.intentionalDisconnect = false;
    const q = this.socket.io.opts.query as Record<string, string>;
    const tokenChanged = q.token !== authToken;
    q.token = authToken;
    if (!this.enabled) {
      this.socket.connect();
      this.enabled = true;
      return;
    }
    if (tokenChanged) {
      this.intentionalDisconnect = true;
      this.socket.disconnect();
      this.intentionalDisconnect = false;
      this.socket.connect();
      return;
    }
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  disable(): void {
    this.intentionalDisconnect = true;
    this.clearReconnectingQuery();
    this.socket.disconnect();
    this.enabled = false;
  }

  /** Whether the last disconnect was intentional (logout / disable). */
  get wasIntentionalDisconnect(): boolean {
    return this.intentionalDisconnect;
  }

  markReconnecting(): void {
    try {
      (this.socket.io.opts.query as Record<string, string>).reconnection = 'true';
    } catch {
      /* noop */
    }
  }

  clearReconnectingQuery(): void {
    try {
      delete (this.socket.io.opts.query as Record<string, string>).reconnection;
    } catch {
      /* noop */
    }
  }

  get raw(): Socket {
    return this.socket;
  }

  get isEnabled(): boolean {
    return this.enabled;
  }

  get connected(): boolean {
    return this.socket.connected;
  }

  updateAuthToken(token: string): void {
    try {
      (this.socket.io.opts.query as Record<string, string>).token = token;
    } catch {
      /* noop */
    }
  }

  waitConnected(timeoutMs = appConfig.timeoutMs): Promise<void> {
    if (this.socket.connected) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const t = window.setTimeout(() => {
        cleanup();
        reject(new ApiError(ApiErrorEnum.SOCKET_ERROR, 'Socket connect timeout'));
      }, timeoutMs);
      const cleanup = () => {
        clearTimeout(t);
        this.socket.off('connect', onConnect);
        this.socket.off('disconnect', onDisconnect);
      };
      const onConnect = () => {
        cleanup();
        resolve();
      };
      const onDisconnect = (reason: string) => {
        cleanup();
        reject(new ApiError(ApiErrorEnum.SOCKET_ERROR, `Socket closed (${reason})`));
      };
      this.socket.once('connect', onConnect);
      this.socket.once('disconnect', onDisconnect);
    });
  }

  emit<T, R>(message: string, data?: T): Promise<R> {
    return new Promise((resolve, reject) => {
      let settled = false;
      this.socket.emit(message, data, (response: SocketAck<R>) => {
        if (response && response.message !== 'ok') {
          if (settled) {
            return;
          }
          settled = true;
          const fallback = String(response.message ?? 'Socket error');
          reject(
            new ApiError(
              ApiErrorEnum.SOCKET_ERROR,
              socketAckErrorMessage(response.data, fallback),
            ),
          );
          return;
        }
        if (settled) {
          return;
        }
        settled = true;
        resolve(response?.data as R);
      });
    });
  }

  on<T>(event: string, fn: (data: T) => void): void {
    this.socket.on(event, fn);
  }

  off(event: string, fn?: (...args: unknown[]) => void): void {
    if (fn) {
      this.socket.off(event, fn);
      return;
    }
    this.socket.off(event);
  }
}

let singleton: PtcgSocketManager | null = null;

export function getSocketManager(): PtcgSocketManager {
  if (!singleton) {
    singleton = new PtcgSocketManager();
  }
  return singleton;
}
