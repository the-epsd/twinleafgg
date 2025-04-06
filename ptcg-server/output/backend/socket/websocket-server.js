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
            pingInterval: 15000,
            pingTimeout: 20000,
            connectTimeout: 45000,
            transports: ['websocket'],
            allowUpgrades: true,
            upgradeTimeout: 45000,
            perMessageDeflate: true,
            httpCompression: true,
            allowEIO3: true,
            maxHttpBufferSize: 1e8,
            cors: config_1.config.backend.allowCors ? { origin: '*' } : undefined
        };
        try {
            const server = new socket_io_1.Server(httpServer, opts);
            this.server = server;
            server.use(auth_middleware_1.authMiddleware);
            // Add error handling
            server.on('error', (error) => {
                console.error('[Socket] Server error:', error);
            });
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
                console.error('[Socket] Connection rejected: Missing user data');
                socket.disconnect();
                return;
            }
            // Generate a unique ID for this connection
            const connectionId = `${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            console.log(`[Socket] New connection: User ${user.name} (${user.id}) [${connectionId}]`);
            const socketClient = new socket_client_1.SocketClient(user, this.core, this.server, socket);
            this.clients.set(connectionId, socketClient);
            this.core.connect(socketClient);
            socketClient.attachListeners();
            socket.conn.on('upgrade', (transport) => {
                console.log(`[Socket] Transport upgrade: ${user.name} [${connectionId}] -> ${transport.name}`);
            });
            socket.conn.on('packet', (packet) => {
                if (packet.type === 'ping') {
                    // Only log pings if they're delayed or if we're debugging
                    const now = Date.now();
                    const lastPing = socket.lastPing || now;
                    if (now - lastPing > 30000) { // Log if ping interval is > 30s
                        console.log(`[Socket] Delayed heartbeat: ${user.name} [${connectionId}] (${now - lastPing}ms)`);
                    }
                    socket.lastPing = now;
                }
            });
            socket.on('disconnect', (reason) => {
                try {
                    console.log(`[Socket] Disconnect: ${user.name} [${connectionId}] - ${reason}`);
                    user.updateLastSeen();
                    this.clients.delete(connectionId);
                    socketClient.dispose();
                }
                catch (error) {
                    console.error(`[Socket] Error during disconnect: ${user.name} [${connectionId}] - ${error.message}`);
                }
            });
            socket.on('error', (error) => {
                console.error(`[Socket] Error: ${user.name} [${connectionId}] - ${error.message}`);
            });
        }
        catch (error) {
            console.error('[Socket] Connection error:', error.message);
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
            // Only log stats if there are significant changes or issues
            const lastStats = this.lastStats || { clientCount: 0, cpuUsage: 0, memoryUsage: 0 };
            const hasSignificantChange = Math.abs(clientCount - lastStats.clientCount) > 5 ||
                Math.abs(cpuUsage - lastStats.cpuUsage) > 10 ||
                Math.abs(memoryUsage.rss - lastStats.memoryUsage) > 100 * 1024 * 1024; // 100MB change
            if (hasSignificantChange) {
                console.log(`[Stats] Connections: ${clientCount} (${clientCount - lastStats.clientCount > 0 ? '+' : ''}${clientCount - lastStats.clientCount}), CPU: ${cpuUsage.toFixed(1)}%, Memory: ${this.formatMemory(memoryUsage.rss)}`);
                // Store current stats for next comparison
                this.lastStats = { clientCount, cpuUsage, memoryUsage: memoryUsage.rss };
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
            console.error('[Stats] Error logging server stats:', error.message);
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
