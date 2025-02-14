"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSocket = void 0;
const game_1 = require("../../game");
const utils_1 = require("../../utils");
const change_avatar_action_1 = require("../../game/store/actions/change-avatar-action");
const core_socket_1 = require("./core-socket");
const errors_1 = require("../common/errors");
const resolve_prompt_action_1 = require("../../game/store/actions/resolve-prompt-action");
const state_sanitizer_1 = require("./state-sanitizer");
class GameSocket {
    constructor(client, socket, core, cache) {
        this.MAX_MESSAGE_LENGTH = 256;
        this.MIN_MESSAGE_LENGTH = 1;
        if (!client || !socket || !core || !cache) {
            throw new Error('Required dependencies missing in GameSocket constructor');
        }
        this.cache = cache;
        this.client = client;
        this.socket = socket;
        this.core = core;
        this.stateSanitizer = new state_sanitizer_1.StateSanitizer(client, cache);
        // Bind methods to avoid context issues
        const boundMethods = {
            joinGame: this.joinGame.bind(this),
            leaveGame: this.leaveGame.bind(this),
            getGameStatus: this.getGameStatus.bind(this),
            ability: this.ability.bind(this),
            trainerability: this.trainerability.bind(this),
            attack: this.attack.bind(this),
            stadium: this.stadium.bind(this),
            playGame: this.playGame.bind(this),
            playCard: this.playCard.bind(this),
            resolvePrompt: this.resolvePrompt.bind(this),
            retreat: this.retreat.bind(this),
            reorderBench: this.reorderBench.bind(this),
            reorderHand: this.reorderHand.bind(this),
            passTurn: this.passTurn.bind(this),
            appendLog: this.appendLog.bind(this),
            changeAvatar: this.changeAvatar.bind(this)
        };
        // Add listeners with error handling
        try {
            this.socket.addListener('game:join', boundMethods.joinGame);
            this.socket.addListener('game:leave', boundMethods.leaveGame);
            this.socket.addListener('game:getStatus', boundMethods.getGameStatus);
            this.socket.addListener('game:action:ability', boundMethods.ability);
            this.socket.addListener('game:action:trainerAbility', boundMethods.trainerability);
            this.socket.addListener('game:action:attack', boundMethods.attack);
            this.socket.addListener('game:action:stadium', boundMethods.stadium);
            this.socket.addListener('game:action:play', boundMethods.playGame);
            this.socket.addListener('game:action:playCard', boundMethods.playCard);
            this.socket.addListener('game:action:resolvePrompt', boundMethods.resolvePrompt);
            this.socket.addListener('game:action:retreat', boundMethods.retreat);
            this.socket.addListener('game:action:reorderBench', boundMethods.reorderBench);
            this.socket.addListener('game:action:reorderHand', boundMethods.reorderHand);
            this.socket.addListener('game:action:passTurn', boundMethods.passTurn);
            this.socket.addListener('game:action:appendLog', boundMethods.appendLog);
            this.socket.addListener('game:action:changeAvatar', boundMethods.changeAvatar);
        }
        catch (error) {
            console.error('Failed to initialize game socket listeners:', error);
            throw error;
        }
    }
    onGameJoin(game, client) {
        try {
            if (!game || !client)
                return;
            this.socket.emit(`game[${game.id}]:join`, { clientId: client.id });
        }
        catch (error) {
            console.error('Error in onGameJoin:', error);
        }
    }
    onGameLeave(game, client) {
        try {
            if (!game || !client)
                return;
            this.socket.emit(`game[${game.id}]:leave`, { clientId: client.id });
        }
        catch (error) {
            console.error('Error in onGameLeave:', error);
        }
    }
    onStateChange(game, state) {
        try {
            if (!game || !state || this.core.games.indexOf(game) === -1)
                return;
            // Throttle state updates to prevent CPU spikes
            const sanitizedState = this.stateSanitizer.sanitize(game.state, game.id);
            const serializer = new game_1.StateSerializer();
            const serializedState = serializer.serialize(sanitizedState);
            const base64 = new utils_1.Base64();
            const stateData = base64.encode(serializedState);
            const playerStats = game.playerStats;
            this.socket.emit(`game[${game.id}]:stateChange`, { stateData, playerStats });
        }
        catch (error) {
            console.error('Error in onStateChange:', error);
        }
    }
    joinGame(gameId, response) {
        try {
            const game = this.core.games.find(g => g.id === gameId);
            if (!game) {
                response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
                return;
            }
            this.cache.lastLogIdCache[game.id] = 0;
            this.core.joinGame(this.client, game);
            response('ok', core_socket_1.CoreSocket.buildGameState(game));
        }
        catch (error) {
            console.error('Error in joinGame:', error);
            response('error', errors_1.ApiErrorEnum.SOCKET_ERROR);
        }
    }
    leaveGame(gameId, response) {
        try {
            const game = this.core.games.find(g => g.id === gameId);
            if (!game) {
                response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
                return;
            }
            delete this.cache.lastLogIdCache[game.id];
            this.core.leaveGame(this.client, game);
            response('ok');
        }
        catch (error) {
            console.error('Error in leaveGame:', error);
            response('error', errors_1.ApiErrorEnum.SOCKET_ERROR);
        }
    }
    getGameStatus(gameId, response) {
        try {
            const game = this.core.games.find(g => g.id === gameId);
            if (!game) {
                response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
                return;
            }
            response('ok', core_socket_1.CoreSocket.buildGameState(game));
        }
        catch (error) {
            console.error('Error in getGameStatus:', error);
            response('error', errors_1.ApiErrorEnum.SOCKET_ERROR);
        }
    }
    dispatch(gameId, action, response) {
        try {
            const game = this.core.games.find(g => g.id === gameId);
            if (!game) {
                response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
                return;
            }
            game.dispatch(this.client, action);
            response('ok');
        }
        catch (error) {
            console.error('Error in dispatch:', error);
            response('error', error.message);
        }
    }
    ability(params, response) {
        const action = new game_1.UseAbilityAction(this.client.id, params.ability, params.target);
        this.dispatch(params.gameId, action, response);
    }
    trainerability(params, response) {
        const action = new game_1.UseTrainerAbilityAction(this.client.id, params.ability, params.target);
        this.dispatch(params.gameId, action, response);
    }
    attack(params, response) {
        const action = new game_1.AttackAction(this.client.id, params.attack);
        this.dispatch(params.gameId, action, response);
    }
    stadium(params, response) {
        const action = new game_1.UseStadiumAction(this.client.id);
        this.dispatch(params.gameId, action, response);
    }
    playGame(params, response) {
        const action = new game_1.AddPlayerAction(this.client.id, this.client.user.name, params.deck);
        this.dispatch(params.gameId, action, response);
    }
    playCard(params, response) {
        const action = new game_1.PlayCardAction(this.client.id, params.handIndex, params.target);
        this.dispatch(params.gameId, action, response);
    }
    resolvePrompt(params, response) {
        try {
            if (!params || !params.gameId || typeof params.id !== 'number') {
                response('error', errors_1.ApiErrorEnum.INVALID_PARAMETERS);
                return;
            }
            const game = this.core.games.find(g => g.id === params.gameId);
            if (!game) {
                response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
                return;
            }
            const prompt = game.state.prompts.find(p => p.id === params.id);
            if (!prompt) {
                response('error', errors_1.ApiErrorEnum.PROMPT_INVALID_ID);
                return;
            }
            const decodedResult = prompt.decode(params.result, game.state);
            if (!prompt.validate(decodedResult, game.state)) {
                response('error', errors_1.ApiErrorEnum.PROMPT_INVALID_RESULT);
                return;
            }
            const action = new resolve_prompt_action_1.ResolvePromptAction(params.id, decodedResult);
            this.dispatch(params.gameId, action, response);
        }
        catch (error) {
            console.error('Error in resolvePrompt:', error);
            response('error', errors_1.ApiErrorEnum.SOCKET_ERROR);
        }
    }
    reorderBench(params, response) {
        if (!params || !params.gameId || typeof params.from !== 'number' || typeof params.to !== 'number') {
            response('error', errors_1.ApiErrorEnum.INVALID_PARAMETERS);
            return;
        }
        const action = new game_1.ReorderBenchAction(this.client.id, params.from, params.to);
        this.dispatch(params.gameId, action, response);
    }
    reorderHand(params, response) {
        if (!params || !params.gameId || !Array.isArray(params.order)) {
            response('error', errors_1.ApiErrorEnum.INVALID_PARAMETERS);
            return;
        }
        const action = new game_1.ReorderHandAction(this.client.id, params.order);
        this.dispatch(params.gameId, action, response);
    }
    retreat(params, response) {
        const action = new game_1.RetreatAction(this.client.id, params.to);
        this.dispatch(params.gameId, action, response);
    }
    passTurn(params, response) {
        const action = new game_1.PassTurnAction(this.client.id);
        this.dispatch(params.gameId, action, response);
    }
    appendLog(params, response) {
        try {
            if (!params || !params.gameId) {
                response('error', errors_1.ApiErrorEnum.INVALID_PARAMETERS);
                return;
            }
            const message = (params.message || '').trim();
            if (message.length < this.MIN_MESSAGE_LENGTH || message.length > this.MAX_MESSAGE_LENGTH) {
                response('error', errors_1.ApiErrorEnum.CANNOT_SEND_MESSAGE);
                return;
            }
            const action = new game_1.AppendLogAction(this.client.id, game_1.GameLog.LOG_TEXT, { text: message });
            this.dispatch(params.gameId, action, response);
        }
        catch (error) {
            console.error('Error in appendLog:', error);
            response('error', errors_1.ApiErrorEnum.SOCKET_ERROR);
        }
    }
    changeAvatar(params, response) {
        const action = new change_avatar_action_1.ChangeAvatarAction(this.client.id, params.avatarName);
        this.dispatch(params.gameId, action, response);
    }
}
exports.GameSocket = GameSocket;
