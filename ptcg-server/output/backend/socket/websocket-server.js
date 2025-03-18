"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServer = void 0;
const socket_io_1 = require("socket.io");
const socket_client_1 = require("./socket-client");
const auth_middleware_1 = require("./auth-middleware");
const config_1 = require("../../config");
class WebSocketServer {
    constructor(core) {
        this.core = core;
    }
    async listen(httpServer) {
        const opts = {
            pingInterval: 45000,
            pingTimeout: 300000,
            connectTimeout: 10000,
            transports: ['websocket', 'polling'],
            allowUpgrades: true,
            maxHttpBufferSize: 1e8, // 100 MB
        };
        if (config_1.config.backend.allowCors) {
            opts.cors = { origin: '*' };
        }
        const server = new socket_io_1.Server(httpServer, opts);
        this.server = server;
        server.use(auth_middleware_1.authMiddleware);
        server.on('connection', (socket) => {
            var _a;
            const user = socket.user;
            let lastActivity = Date.now();
            let isInGame = false;
            // Log initial connection
            console.log(`[Connect] User ${user.name} (${user.id}) | ` +
                `Client: ${((_a = socket.handshake.headers['user-agent']) === null || _a === void 0 ? void 0 : _a.split(' ').pop()) || 'unknown'}`);
            // Track activity and game state
            socket.onAny((eventName) => {
                lastActivity = Date.now();
                if (eventName.startsWith('game:')) {
                    isInGame = true;
                }
            });
            // Monitor disconnects with enhanced context
            socket.on('disconnect', (reason) => {
                const timeSinceLastActivity = Date.now() - lastActivity;
                const disconnectContext = {
                    reason,
                    inGame: isInGame,
                    timeSinceLastActivity: Math.floor(timeSinceLastActivity / 1000),
                    wasActive: timeSinceLastActivity < 5000,
                    hadVisibilityEvent: socket.handshake.query.lastVisibilityState === 'hidden'
                };
                // Categorize the disconnect
                let disconnectType = 'Unknown';
                if (reason === 'transport close') {
                    if (!isInGame && timeSinceLastActivity > 30000) {
                        disconnectType = 'Likely Tab Close (Inactive)';
                    }
                    else if (isInGame && !disconnectContext.wasActive) {
                        disconnectType = 'Possible Tab Close (In Game)';
                    }
                    else if (disconnectContext.wasActive) {
                        disconnectType = 'Unexpected Transport Close (Was Active)';
                    }
                }
                else if (reason === 'ping timeout') {
                    disconnectType = 'Connection Issue (Ping Timeout)';
                }
                else if (reason === 'client namespace disconnect') {
                    disconnectType = 'Client Initiated Disconnect';
                }
                // Log the enhanced disconnect info
                console.log(`[Disconnect] User ${user.name} (${user.id}) | ` +
                    `Type: ${disconnectType} | ` +
                    `Last Activity: ${disconnectContext.timeSinceLastActivity}s ago | ` +
                    `In Game: ${disconnectContext.inGame} | ` +
                    `Was Active: ${disconnectContext.wasActive}`);
                // If it was an unexpected disconnect during gameplay, log additional context
                if (isInGame && disconnectContext.wasActive && reason === 'transport close') {
                    console.log(`[Unexpected Game Disconnect] User ${user.name} (${user.id}) | ` +
                        `Last Activity: ${new Date(lastActivity).toISOString()} | ` +
                        `Session Duration: ${Math.floor((Date.now() - socket.handshake.issued) / 1000)}s`);
                }
                this.core.disconnect(socketClient);
                user.updateLastSeen();
            });
            // Track visibility events from client
            socket.on('visibility', (state) => {
                console.log(`[Visibility] User ${user.name} (${user.id}) tab became ${state}`);
                socket.handshake.query.lastVisibilityState = state;
            });
            // Monitor transport changes
            socket.conn.on('upgrade', (transport) => {
                console.log(`[Transport] User ${user.name} (${user.id}) upgraded to ${transport.name}`);
            });
            // Monitor packet events
            socket.conn.on('packet', (packet) => {
                if (packet.type === 'ping' || packet.type === 'pong')
                    return; // Skip logging heartbeats
                console.log(`[Packet] User ${user.name} (${user.id}) ${packet.type}`);
            });
            // Monitor close events with more detail
            socket.conn.on('close', (reason) => {
                console.log(`[Transport Close] User ${user.name} (${user.id}) | ` +
                    `Reason: ${reason} | ` +
                    `Last Transport: ${socket.conn.transport.name} | ` +
                    `Connected Duration: ${(Date.now() - socket.handshake.issued) / 1000}s`);
            });
            // Monitor errors
            socket.on('error', (error) => {
                console.error(`[Socket Error] User ${user.name} (${user.id}):`, error);
            });
            socket.conn.on('error', (error) => {
                console.error(`[Transport Error] User ${user.name} (${user.id}):`, error);
            });
            // Monitor ping/pong
            let lastPing = Date.now();
            socket.conn.on('ping', () => {
                lastPing = Date.now();
                console.log(`[Ping] User ${user.name} (${user.id})`);
            });
            socket.conn.on('pong', () => {
                const latency = Date.now() - lastPing;
                if (latency > 1000) { // Log high latency
                    console.log(`[High Latency] User ${user.name} (${user.id}) - ${latency}ms`);
                }
            });
            // WebSocket specific monitoring
            if (socket.conn.transport.name === 'websocket') {
                const ws = socket.conn.transport.ws;
                if (ws) {
                    ws.on('unexpected-response', (req, res) => {
                        console.error(`[WebSocket Error] User ${user.name} (${user.id}) unexpected response:`, res.statusCode, res.statusMessage);
                    });
                }
            }
            // Create and connect the socket client
            const socketClient = new socket_client_1.SocketClient(user, this.core, server, socket);
            this.core.connect(socketClient);
            socketClient.attachListeners();
        });
    }
}
exports.WebSocketServer = WebSocketServer;
