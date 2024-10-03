"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchmakingController = void 0;
const matchmaking_service_1 = require("../services/matchmaking.service");
const controller_1 = require("./controller");
class MatchmakingController extends controller_1.Controller {
    constructor(path, router, authMiddleware, validator, io, core) {
        super(path, router, authMiddleware, validator);
        this.joinQueue = (req, res) => {
            var _a;
            const { format } = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            this.matchmakingService.addToQueue(userId, format);
            res.status(200).json({ message: 'Joined queue successfully' });
        };
        this.leaveQueue = (req, res) => {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            this.matchmakingService.removeFromQueue(userId);
            res.status(200).json({ message: 'Left queue successfully' });
        };
        this.matchmakingService = new matchmaking_service_1.MatchmakingService(core);
        this.io = io;
        this.setupWebSocket();
    }
    setupWebSocket() {
        this.io.on('connection', (socket) => {
            socket.on('joinQueue', async (data, callback) => {
                var _a;
                try {
                    const userId = (_a = socket.user) === null || _a === void 0 ? void 0 : _a.id;
                    await this.matchmakingService.addToQueue(userId, data.format);
                    callback({ success: true });
                }
                catch (error) {
                    if (error instanceof Error) {
                        callback({ success: false, error: error.message });
                    }
                    else {
                        callback({ success: false, error: 'An unknown error occurred' });
                    }
                }
            });
            socket.on('leaveQueue', () => {
                var _a;
                const userId = (_a = socket.user) === null || _a === void 0 ? void 0 : _a.id;
                console.log(`WebSocket: User ${userId} attempting to leave queue`);
                this.matchmakingService.removeFromQueue(userId);
            });
        });
        this.matchmakingService.queueUpdates.on('lobbyUpdate', (data) => {
            console.log('Emitting lobby update:', data);
            this.io.emit('queueUpdate', data);
        });
        this.matchmakingService.queueUpdates.on('gameStarted', (data) => {
            console.log('Emitting game started:', data);
            this.io.to(data.players[0]).to(data.players[1]).emit('gameStarted', { gameId: data.gameId });
        });
    }
}
exports.MatchmakingController = MatchmakingController;
