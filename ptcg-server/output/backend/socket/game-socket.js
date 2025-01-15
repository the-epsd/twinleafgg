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
        this.boundListeners = {
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
        this.cache = cache;
        this.client = client;
        this.socket = socket;
        this.core = core;
        this.stateSanitizer = new state_sanitizer_1.StateSanitizer(client, cache);
        // game listeners
        this.socket.addListener('game:join', this.boundListeners.joinGame);
        this.socket.addListener('game:leave', this.boundListeners.leaveGame);
        this.socket.addListener('game:getStatus', this.boundListeners.getGameStatus);
        this.socket.addListener('game:action:ability', this.boundListeners.ability);
        this.socket.addListener('game:action:ability', this.boundListeners.trainerability);
        this.socket.addListener('game:action:attack', this.boundListeners.attack);
        this.socket.addListener('game:action:stadium', this.boundListeners.stadium);
        this.socket.addListener('game:action:play', this.boundListeners.playGame);
        this.socket.addListener('game:action:playCard', this.boundListeners.playCard);
        this.socket.addListener('game:action:resolvePrompt', this.boundListeners.resolvePrompt);
        this.socket.addListener('game:action:retreat', this.boundListeners.retreat);
        this.socket.addListener('game:action:reorderBench', this.boundListeners.reorderBench);
        this.socket.addListener('game:action:reorderHand', this.boundListeners.reorderHand);
        this.socket.addListener('game:action:passTurn', this.boundListeners.passTurn);
        this.socket.addListener('game:action:appendLog', this.boundListeners.appendLog);
        this.socket.addListener('game:action:changeAvatar', this.boundListeners.changeAvatar);
    }
    destroy() {
        this.socket.socket.removeListener('game:join', this.boundListeners.joinGame);
        this.socket.socket.removeListener('game:leave', this.boundListeners.leaveGame);
        this.socket.socket.removeListener('game:getStatus', this.boundListeners.getGameStatus);
        this.socket.socket.removeListener('game:action:ability', this.boundListeners.ability);
        this.socket.socket.removeListener('game:action:ability', this.boundListeners.trainerability);
        this.socket.socket.removeListener('game:action:attack', this.boundListeners.attack);
        this.socket.socket.removeListener('game:action:stadium', this.boundListeners.stadium);
        this.socket.socket.removeListener('game:action:play', this.boundListeners.playGame);
        this.socket.socket.removeListener('game:action:playCard', this.boundListeners.playCard);
        this.socket.socket.removeListener('game:action:resolvePrompt', this.boundListeners.resolvePrompt);
        this.socket.socket.removeListener('game:action:retreat', this.boundListeners.retreat);
        this.socket.socket.removeListener('game:action:reorderBench', this.boundListeners.reorderBench);
        this.socket.socket.removeListener('game:action:reorderHand', this.boundListeners.reorderHand);
        this.socket.socket.removeListener('game:action:passTurn', this.boundListeners.passTurn);
        this.socket.socket.removeListener('game:action:appendLog', this.boundListeners.appendLog);
        this.socket.socket.removeListener('game:action:changeAvatar', this.boundListeners.changeAvatar);
        if (this.cache) {
            delete this.cache.lastLogIdCache[this.client.id];
        }
    }
    onGameJoin(game, client) {
        this.socket.emit(`game[${game.id}]:join`, { clientId: client.id });
    }
    onGameLeave(game, client) {
        this.socket.emit(`game[${game.id}]:leave`, { clientId: client.id });
    }
    onStateChange(game, state) {
        if (this.core.games.indexOf(game) !== -1) {
            state = this.stateSanitizer.sanitize(game.state, game.id);
            const serializer = new game_1.StateSerializer();
            const serializedState = serializer.serialize(state);
            const base64 = new utils_1.Base64();
            const stateData = base64.encode(serializedState);
            const playerStats = game.playerStats;
            this.socket.emit(`game[${game.id}]:stateChange`, { stateData, playerStats });
        }
    }
    joinGame(gameId, response) {
        const game = this.core.games.find(g => g.id === gameId);
        if (game === undefined) {
            response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
            return;
        }
        this.cache.lastLogIdCache[game.id] = 0;
        this.core.joinGame(this.client, game);
        response('ok', core_socket_1.CoreSocket.buildGameState(game));
    }
    leaveGame(gameId, response) {
        const game = this.core.games.find(g => g.id === gameId);
        if (game === undefined) {
            response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
            return;
        }
        delete this.cache.lastLogIdCache[game.id];
        this.core.leaveGame(this.client, game);
        response('ok');
    }
    getGameStatus(gameId, response) {
        const game = this.core.games.find(g => g.id === gameId);
        if (game === undefined) {
            response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
            return;
        }
        response('ok', core_socket_1.CoreSocket.buildGameState(game));
    }
    dispatch(gameId, action, response) {
        const game = this.core.games.find(g => g.id === gameId);
        if (game === undefined) {
            response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
            return;
        }
        try {
            game.dispatch(this.client, action);
        }
        catch (err) {
            if (err instanceof Error) {
                response('error', err.message);
            }
            else {
                response('error', errors_1.ApiErrorEnum.UNKNOWN_ERROR);
            }
            return;
        }
        response('ok');
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
        const game = this.core.games.find(g => g.id === params.gameId);
        if (game === undefined) {
            response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
            return;
        }
        const prompt = game.state.prompts.find(p => p.id === params.id);
        if (prompt === undefined) {
            response('error', errors_1.ApiErrorEnum.PROMPT_INVALID_ID);
            return;
        }
        try {
            params.result = prompt.decode(params.result, game.state);
            if (prompt.validate(params.result, game.state) === false) {
                response('error', errors_1.ApiErrorEnum.PROMPT_INVALID_RESULT);
                return;
            }
        }
        catch (err) {
            response('error', errors_1.ApiErrorEnum.PROMPT_INVALID_RESULT);
            return;
        }
        const action = new resolve_prompt_action_1.ResolvePromptAction(params.id, params.result);
        this.dispatch(params.gameId, action, response);
    }
    reorderBench(params, response) {
        const action = new game_1.ReorderBenchAction(this.client.id, params.from, params.to);
        this.dispatch(params.gameId, action, response);
    }
    reorderHand(params, response) {
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
        const message = (params.message || '').trim();
        if (message.length === 0 || message.length > 256) {
            response('error', errors_1.ApiErrorEnum.CANNOT_SEND_MESSAGE);
        }
        const action = new game_1.AppendLogAction(this.client.id, game_1.GameLog.LOG_TEXT, { text: message });
        this.dispatch(params.gameId, action, response);
    }
    changeAvatar(params, response) {
        const action = new change_avatar_action_1.ChangeAvatarAction(this.client.id, params.avatarName);
        this.dispatch(params.gameId, action, response);
    }
}
exports.GameSocket = GameSocket;
