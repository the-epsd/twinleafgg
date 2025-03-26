"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketClient = void 0;
const core_socket_1 = require("./core-socket");
const game_socket_1 = require("./game-socket");
const message_socket_1 = require("./message-socket");
const socket_cache_1 = require("./socket-cache");
const socket_wrapper_1 = require("./socket-wrapper");
const matchmaking_socket_1 = require("./matchmaking-socket");
class SocketClient {
    constructor(user, core, io, socket) {
        this.id = 0;
        this.games = [];
        this.cache = new socket_cache_1.SocketCache();
        this._isDisposed = false;
        this.id = Math.floor(Math.random() * 1000000);
        this.user = user;
        this.name = user.name;
        this.socket = new socket_wrapper_1.SocketWrapper(io, socket);
        this.core = core;
        console.log(`[Socket] Client created: ${user.name} [${this.id}]`);
        this.coreSocket = new core_socket_1.CoreSocket(this, this.socket, core, this.cache);
        this.gameSocket = new game_socket_1.GameSocket(this, this.socket, core, this.cache);
        this.messageSocket = new message_socket_1.MessageSocket(this, this.socket, core);
        this.matchmakingSocket = new matchmaking_socket_1.MatchmakingSocket(this, this.socket, core);
    }
    onConnect(client) {
        try {
            if (this._isDisposed)
                return;
            this.coreSocket.onConnect(client);
        }
        catch (error) {
            console.error(`[Socket] Connect error: ${this.name} [${this.id}] - ${error.message}`);
        }
    }
    onDisconnect(client) {
        try {
            if (this._isDisposed)
                return;
            this.coreSocket.onDisconnect(client);
        }
        catch (error) {
            console.error(`[Socket] Disconnect error: ${this.name} [${this.id}] - ${error.message}`);
        }
    }
    onGameAdd(game) {
        try {
            if (this._isDisposed)
                return;
            this.coreSocket.onGameAdd(game);
        }
        catch (error) {
            console.error(`[Socket] Game add error: ${this.name} [${this.id}] - ${error.message}`);
        }
    }
    onGameDelete(game) {
        try {
            if (this._isDisposed)
                return;
            this.coreSocket.onGameDelete(game);
        }
        catch (error) {
            console.error(`[Socket] Game delete error: ${this.name} [${this.id}] - ${error.message}`);
        }
    }
    onUsersUpdate(users) {
        try {
            if (this._isDisposed)
                return;
            this.coreSocket.onUsersUpdate(users);
        }
        catch (error) {
            console.error(`[Socket] Users update error: ${this.name} [${this.id}] - ${error.message}`);
        }
    }
    onStateChange(game, state) {
        try {
            if (this._isDisposed)
                return;
            this.coreSocket.onStateChange(game, state);
            this.gameSocket.onStateChange(game, state);
        }
        catch (error) {
            console.error(`[Socket] State change error: ${this.name} [${this.id}] - ${error.message}`);
        }
    }
    onGameJoin(game, client) {
        try {
            if (this._isDisposed)
                return;
            this.gameSocket.onGameJoin(game, client);
        }
        catch (error) {
            console.error(`[Socket] Game join error: ${this.name} [${this.id}] - ${error.message}`);
        }
    }
    onGameLeave(game, client) {
        try {
            if (this._isDisposed)
                return;
            this.gameSocket.onGameLeave(game, client);
        }
        catch (error) {
            console.error(`[Socket] Game leave error: ${this.name} [${this.id}] - ${error.message}`);
        }
    }
    onJoinQueue(from, message) {
        try {
            if (this._isDisposed)
                return;
            this.matchmakingSocket.onJoinQueue(from, message);
        }
        catch (error) {
            console.error(`[Socket] Queue join error: ${this.name} [${this.id}] - ${error.message}`);
        }
    }
    onLeaveQueue() {
        try {
            if (this._isDisposed)
                return;
            this.matchmakingSocket.onLeaveQueue();
        }
        catch (error) {
            console.error(`[Socket] Queue leave error: ${this.name} [${this.id}] - ${error.message}`);
        }
    }
    onMessage(from, message) {
        try {
            if (this._isDisposed)
                return;
            this.messageSocket.onMessage(from, message);
        }
        catch (error) {
            console.error(`[Socket] Message error: ${this.name} [${this.id}] - ${error.message}`);
        }
    }
    onMessageRead(user) {
        try {
            if (this._isDisposed)
                return;
            this.messageSocket.onMessageRead(user);
        }
        catch (error) {
            console.error(`[Socket] Message read error: ${this.name} [${this.id}] - ${error.message}`);
        }
    }
    attachListeners() {
        try {
            if (this._isDisposed)
                return;
            this.socket.attachListeners();
        }
        catch (error) {
            console.error(`[Socket] Listener attach error: ${this.name} [${this.id}] - ${error.message}`);
        }
    }
    dispose() {
        var _a;
        try {
            if (this._isDisposed)
                return;
            console.log(`[Socket] Disposing client: ${this.name} [${this.id}]`);
            if ((_a = this.socket) === null || _a === void 0 ? void 0 : _a.socket) {
                this.socket.socket.removeAllListeners();
            }
            if (this.matchmakingSocket) {
                this.matchmakingSocket.dispose();
            }
            if (this.gameSocket) {
                for (const game of this.games) {
                    try {
                        this.core.leaveGame(this, game);
                    }
                    catch (error) {
                        console.error(`[Socket] Game leave error: ${this.name} [${this.id}] - Game ${game.id} - ${error.message}`);
                    }
                }
            }
            if (this.coreSocket) {
                this.core.disconnect(this);
            }
            this.games = [];
            if (this.cache) {
                this.cache.gameInfoCache = {};
                this.cache.lastLogIdCache = {};
            }
            this._isDisposed = true;
            console.log(`[Socket] Client disposed: ${this.name} [${this.id}]`);
        }
        catch (error) {
            console.error(`[Socket] Disposal error: ${this.name} [${this.id}] - ${error.message}`);
            this._isDisposed = true;
        }
    }
    get isDisposed() {
        return this._isDisposed;
    }
}
exports.SocketClient = SocketClient;
