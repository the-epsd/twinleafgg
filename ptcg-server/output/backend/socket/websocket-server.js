"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServer = void 0;
const socket_io_1 = require("socket.io");
const os = require("os");
const socket_client_1 = require("./socket-client");
const auth_middleware_1 = require("./auth-middleware");
const config_1 = require("../../config");
class WebSocketServer {
    constructor(core) {
        this.core = core;
        this.clients = new Map();
        this.statsInterval = null;
        this.pingInterval = null;
        this.STATS_INTERVAL = 60000; // Log stats every minute
    }
    async listen(httpServer) {
        const opts = {
            pingInterval: 25000,
            pingTimeout: 30000,
            connectTimeout: 30000,
            transports: ['websocket'],
            allowUpgrades: true,
            upgradeTimeout: 30000,
            perMessageDeflate: true,
            httpCompression: true,
            allowEIO3: true,
            maxHttpBufferSize: 1e8, // 100 MB
        };
        if (config_1.config.backend.allowCors) {
            opts.cors = { origin: '*' };
        }
        try {
            const server = new socket_io_1.Server(httpServer, opts);
            this.server = server;
            server.use(auth_middleware_1.authMiddleware);
            server.on('connection', this.handleConnection.bind(this));
            // Set up stats monitoring
            this.statsInterval = setInterval(() => this.logServerStats(), this.STATS_INTERVAL);
            console.log('[Socket] WebSocket server started');
        }
        catch (error) {
            console.error('[Socket] Error starting WebSocket server:', error);
        }
    }
    handleConnection(socket) {
        try {
            const user = socket.user;
            if (!user) {
                console.error('[Socket] Connection without user data, rejecting');
                socket.disconnect();
                return;
            }
            // Generate a unique ID for this connection
            const connectionId = `${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            console.log(`[Socket] User ${user.name} (${user.id}) connected. Transport: ${socket.conn.transport.name}, Connection ID: ${connectionId}`);
            const socketClient = new socket_client_1.SocketClient(user, this.core, this.server, socket);
            // Store client for monitoring
            this.clients.set(connectionId, socketClient);
            this.core.connect(socketClient);
            socketClient.attachListeners();
            socket.conn.on('upgrade', (transport) => {
                console.log(`[Socket] Transport upgraded for user ${user.name} (${user.id}): ${transport.name}, Connection ID: ${connectionId}`);
            });
            socket.conn.on('packet', (packet) => {
                if (packet.type === 'ping') {
                    // For performance, only log some pings for monitoring
                    if (Math.random() < 0.1) { // Log roughly 10% of pings
                        console.log(`[Socket] Heartbeat received from user ${user.name} (${user.id}), Connection ID: ${connectionId}`);
                    }
                }
            });
            socket.on('disconnect', (reason) => {
                try {
                    console.log(`[Socket] User ${user.name} (${user.id}) disconnected. Reason: ${reason}, Connection ID: ${connectionId}`);
                    this.core.disconnect(socketClient);
                    user.updateLastSeen();
                    // Remove from clients map
                    this.clients.delete(connectionId);
                    // Explicitly dispose
                    socketClient.dispose();
                }
                catch (error) {
                    console.error(`[Socket] Error handling disconnect for user ${user.name} (${user.id}):`, error);
                }
            });
            socket.on('error', (error) => {
                console.error(`[Socket] Error for user ${user.name} (${user.id}), Connection ID: ${connectionId}:`, error);
            });
        }
        catch (error) {
            console.error('[Socket] Error handling new connection:', error);
            // Attempt to disconnect the problematic socket
            try {
                socket.disconnect();
            }
            catch (e) {
                // Ignore errors in disconnect
            }
        }
    }
    logServerStats() {
        try {
            const cpuUsage = this.getCpuUsagePercent();
            const memoryUsage = process.memoryUsage();
            const clientCount = this.clients.size;
            console.log(`[Stats] Connections: ${clientCount}, CPU: ${cpuUsage.toFixed(1)}%, Memory: ${this.formatMemory(memoryUsage.rss)}`);
            // Log details if there are a lot of connections
            if (clientCount > 50) {
                console.log(`[Stats] High connection count: ${clientCount}`);
            }
            // Warning for high CPU usage
            if (cpuUsage > 70) {
                console.warn(`[Stats] High CPU usage: ${cpuUsage.toFixed(1)}%`);
            }
            // Warning for high memory usage
            if (memoryUsage.rss > 1024 * 1024 * 1024) { // >1GB
                console.warn(`[Stats] High memory usage: ${this.formatMemory(memoryUsage.rss)}`);
            }
        }
        catch (error) {
            console.error('[Stats] Error logging server stats:', error);
        }
    }
    getCpuUsagePercent() {
        try {
            // Simple CPU usage calculation based on OS library
            const cpus = os.cpus();
            let totalIdle = 0;
            let totalTick = 0;
            cpus.forEach(cpu => {
                for (const type in cpu.times) {
                    totalTick += cpu.times[type];
                }
                totalIdle += cpu.times.idle;
            });
            // Calculate CPU usage as percentage of non-idle time
            return 100 - (totalIdle / totalTick * 100);
        }
        catch (error) {
            return 0;
        }
    }
    formatMemory(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }
    dispose() {
        try {
            console.log('[Socket] Disposing WebSocket server');
            // Clear intervals
            if (this.statsInterval) {
                clearInterval(this.statsInterval);
            }
            if (this.pingInterval) {
                clearInterval(this.pingInterval);
            }
            // Clean up all clients
            for (const client of this.clients.values()) {
                try {
                    client.dispose();
                }
                catch (error) {
                    console.error('[Socket] Error disposing client:', error);
                }
            }
            this.clients.clear();
            // Disconnect all sockets
            if (this.server) {
                this.server.disconnectSockets(true);
                this.server.close();
            }
        }
        catch (error) {
            console.error('[Socket] Error disposing WebSocket server:', error);
        }
    }
}
exports.WebSocketServer = WebSocketServer;
