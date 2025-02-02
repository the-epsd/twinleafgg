"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreSocket = void 0;
const game_1 = require("../../game");
const utils_1 = require("../../utils/utils");
const utils_2 = require("../../utils");
class CoreSocket {
    constructor(client, socket, core, cache) {
        this.cache = cache;
        this.client = client;
        this.socket = socket;
        this.core = core;
        // core listeners
        this.socket.addListener('core:getInfo', this.getCoreInfo.bind(this));
        this.socket.addListener('core:createGame', this.createGame.bind(this));
    }
    onConnect(client) {
        this.socket.emit('core:join', {
            clientId: client.id,
            user: CoreSocket.buildUserInfo(client.user)
        });
    }
    onDisconnect(client) {
        this.socket.emit('core:leave', client.id);
    }
    onGameAdd(game) {
        console.log(`New game created. Total active games: ${this.core.games.length}`);
        this.cache.lastLogIdCache[game.id] = 0;
        this.cache.gameInfoCache[game.id] = CoreSocket.buildGameInfo(game);
        this.socket.emit('core:createGame', this.cache.gameInfoCache[game.id]);
    }
    onGameDelete(game) {
        console.log(`Game deleted. Total active games: ${this.core.games.length - 1}`);
        delete this.cache.gameInfoCache[game.id];
        delete this.cache.lastLogIdCache[game.id];
        this.socket.emit('core:deleteGame', game.id);
    }
    onStateChange(game, state) {
        const gameInfo = CoreSocket.buildGameInfo(game);
        if (!utils_1.deepCompare(gameInfo, this.cache.gameInfoCache[game.id])) {
            this.cache.gameInfoCache[game.id] = gameInfo;
            this.socket.emit('core:gameInfo', gameInfo);
        }
    }
    onUsersUpdate(users) {
        const core = this.client.core;
        if (core === undefined) {
            return;
        }
        const me = users.find(u => u.id === this.client.user.id);
        if (me !== undefined) {
            this.client.user = me;
        }
        const userInfos = users.map(u => {
            const connected = core.clients.some(c => c.user.id === u.id);
            return CoreSocket.buildUserInfo(u, connected);
        });
        this.socket.emit('core:usersInfo', userInfos);
    }
    buildCoreInfo() {
        return {
            clientId: this.client.id,
            clients: this.core.clients.map(client => ({
                clientId: client.id,
                userId: client.user.id
            })),
            users: this.core.clients.map(client => CoreSocket.buildUserInfo(client.user)),
            games: this.core.games.map(game => CoreSocket.buildGameInfo(game))
        };
    }
    getCoreInfo(data, response) {
        response('ok', this.buildCoreInfo());
    }
    createGame(params, response) {
        const invited = this.core.clients.find(c => c.id === params.clientId);
        const game = this.core.createGame(this.client, params.deck, params.gameSettings, invited);
        response('ok', CoreSocket.buildGameState(game));
    }
    static buildUserInfo(user, connected = true) {
        return {
            connected,
            userId: user.id,
            name: user.name,
            email: user.email,
            registered: user.registered,
            lastSeen: user.lastSeen,
            ranking: user.ranking,
            rank: user.getRank(),
            lastRankingChange: user.lastRankingChange,
            avatarFile: user.avatarFile
        };
    }
    static buildGameInfo(game) {
        const state = game.state;
        const players = state.players.map(player => ({
            clientId: player.id,
            name: player.name,
            prizes: player.prizes.reduce((sum, cardList) => sum + cardList.cards.length, 0),
            deck: player.deck.cards.length
        }));
        return {
            gameId: game.id,
            phase: state.phase,
            turn: state.turn,
            activePlayer: state.activePlayer,
            players: players
        };
    }
    static buildGameState(game) {
        const serializer = new game_1.StateSerializer();
        const serializedState = serializer.serialize(game.state);
        const base64 = new utils_2.Base64();
        const stateData = base64.encode(serializedState);
        return {
            gameId: game.id,
            stateData,
            clientIds: game.clients.map(client => client.id),
            recordingEnabled: game.gameSettings.recordingEnabled,
            timeLimit: game.gameSettings.timeLimit,
            playerStats: game.playerStats,
            format: game.format
        };
    }
}
exports.CoreSocket = CoreSocket;
