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
        this.user = user;
        this.name = user.name;
        this.socket = new socket_wrapper_1.SocketWrapper(io, socket);
        this.core = core;
        this.coreSocket = new core_socket_1.CoreSocket(this, this.socket, core, this.cache);
        this.gameSocket = new game_socket_1.GameSocket(this, this.socket, core, this.cache);
        this.messageSocket = new message_socket_1.MessageSocket(this, this.socket, core);
        this.matchmakingSocket = new matchmaking_socket_1.MatchmakingSocket(this, this.socket, core);
    }
    onConnect(client) {
        console.log(`Client connected - ID: ${client.id}, Name: ${client.name}`);
        this.coreSocket.onConnect(client);
    }
    onDisconnect(client) {
        console.log(`Client disconnected - ID: ${client.id}, Name: ${client.name}`);
        this.coreSocket.onDisconnect(client);
    }
    onGameAdd(game) {
        this.coreSocket.onGameAdd(game);
    }
    onGameDelete(game) {
        this.coreSocket.onGameDelete(game);
    }
    onUsersUpdate(users) {
        this.coreSocket.onUsersUpdate(users);
    }
    onStateChange(game, state) {
        this.coreSocket.onStateChange(game, state);
        this.gameSocket.onStateChange(game, state);
    }
    onGameJoin(game, client) {
        this.gameSocket.onGameJoin(game, client);
    }
    onGameLeave(game, client) {
        this.gameSocket.onGameLeave(game, client);
    }
    onJoinQueue(from, message) {
        this.matchmakingSocket.onJoinQueue(from, message);
    }
    onLeaveQueue(client) {
        this.matchmakingSocket.onLeaveQueue();
    }
    onMessage(from, message) {
        this.messageSocket.onMessage(from, message);
    }
    onMessageRead(user) {
        this.messageSocket.onMessageRead(user);
    }
    attachListeners() {
        this.socket.attachListeners();
    }
}
exports.SocketClient = SocketClient;
