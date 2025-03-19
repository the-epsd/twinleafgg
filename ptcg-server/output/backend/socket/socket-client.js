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
        this.id = Math.floor(Math.random() * 1000000); // Generate a unique client ID
        this.user = user;
        this.name = user.name;
        this.socket = new socket_wrapper_1.SocketWrapper(io, socket);
        this.core = core;
        console.log(`[Socket] Creating socket client for user ${user.name} (${user.id}) with client ID ${this.id}`);
        // Initialize socket components
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
            console.error(`[Socket] Error in onConnect for client ${this.name}: ${error.message || error}`);
        }
    }
    onDisconnect(client) {
        try {
            if (this._isDisposed)
                return;
            this.coreSocket.onDisconnect(client);
        }
        catch (error) {
            console.error(`[Socket] Error in onDisconnect for client ${this.name}: ${error.message || error}`);
        }
    }
    onGameAdd(game) {
        try {
            if (this._isDisposed)
                return;
            this.coreSocket.onGameAdd(game);
        }
        catch (error) {
            console.error(`[Socket] Error in onGameAdd for client ${this.name}: ${error.message || error}`);
        }
    }
    onGameDelete(game) {
        try {
            if (this._isDisposed)
                return;
            this.coreSocket.onGameDelete(game);
        }
        catch (error) {
            console.error(`[Socket] Error in onGameDelete for client ${this.name}: ${error.message || error}`);
        }
    }
    onUsersUpdate(users) {
        try {
            if (this._isDisposed)
                return;
            this.coreSocket.onUsersUpdate(users);
        }
        catch (error) {
            console.error(`[Socket] Error in onUsersUpdate for client ${this.name}: ${error.message || error}`);
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
            console.error(`[Socket] Error in onStateChange for client ${this.name}: ${error.message || error}`);
        }
    }
    onGameJoin(game, client) {
        try {
            if (this._isDisposed)
                return;
            this.gameSocket.onGameJoin(game, client);
        }
        catch (error) {
            console.error(`[Socket] Error in onGameJoin for client ${this.name}: ${error.message || error}`);
        }
    }
    onGameLeave(game, client) {
        try {
            if (this._isDisposed)
                return;
            this.gameSocket.onGameLeave(game, client);
        }
        catch (error) {
            console.error(`[Socket] Error in onGameLeave for client ${this.name}: ${error.message || error}`);
        }
    }
    onJoinQueue(from, message) {
        try {
            if (this._isDisposed)
                return;
            this.matchmakingSocket.onJoinQueue(from, message);
        }
        catch (error) {
            console.error(`[Socket] Error in onJoinQueue for client ${this.name}: ${error.message || error}`);
        }
    }
    onLeaveQueue() {
        try {
            if (this._isDisposed)
                return;
            this.matchmakingSocket.onLeaveQueue();
        }
        catch (error) {
            console.error(`[Socket] Error in onLeaveQueue for client ${this.name}: ${error.message || error}`);
        }
    }
    onMessage(from, message) {
        try {
            if (this._isDisposed)
                return;
            this.messageSocket.onMessage(from, message);
        }
        catch (error) {
            console.error(`[Socket] Error in onMessage for client ${this.name}: ${error.message || error}`);
        }
    }
    onMessageRead(user) {
        try {
            if (this._isDisposed)
                return;
            this.messageSocket.onMessageRead(user);
        }
        catch (error) {
            console.error(`[Socket] Error in onMessageRead for client ${this.name}: ${error.message || error}`);
        }
    }
    attachListeners() {
        try {
            if (this._isDisposed)
                return;
            this.socket.attachListeners();
        }
        catch (error) {
            console.error(`[Socket] Error attaching listeners for client ${this.name}: ${error.message || error}`);
        }
    }
    dispose() {
        try {
            if (this._isDisposed) {
                console.warn(`[Socket] Client ${this.name} (${this.id}) already disposed`);
                return;
            }
            console.log(`[Socket] Disposing client ${this.name} (${this.id})`);
            this._isDisposed = true;
            // Clean up matchmaking
            if (this.matchmakingSocket) {
                this.matchmakingSocket.dispose();
            }
            // Clear games
            this.games = [];
            // Clear cache references
            if (this.cache) {
                this.cache.gameInfoCache = {};
                this.cache.lastLogIdCache = {};
            }
        }
        catch (error) {
            console.error(`[Socket] Error disposing client ${this.name}: ${error.message || error}`);
        }
    }
    get isDisposed() {
        return this._isDisposed;
    }
}
exports.SocketClient = SocketClient;
