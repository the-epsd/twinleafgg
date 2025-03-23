"use strict";
exports.__esModule = true;
exports.playerStateReducer = void 0;
var change_avatar_action_1 = require("../actions/change-avatar-action");
var reorder_actions_1 = require("../actions/reorder-actions");
function playerStateReducer(store, state, action) {
    if (action instanceof reorder_actions_1.ReorderBenchAction) {
        var player = state.players.find(function (p) { return p.id === action.id; });
        if (player === undefined || player.bench[action.from] === undefined) {
            return state;
        }
        var temp = player.bench[action.from];
        player.bench[action.from] = player.bench[action.to];
        player.bench[action.to] = temp;
        return state;
    }
    // if (action instanceof ReorderHandAction) {
    //   const player = state.players.find(p => p.id === action.id);
    //   if (player === undefined || player.hand.cards.length !== action.order.length) {
    //     return state;
    //   }
    //   player.hand.applyOrder(action.order);
    //   return state;
    // }
    if (action instanceof change_avatar_action_1.ChangeAvatarAction) {
        var player = state.players.find(function (p) { return p.id === action.id; });
        if (player === undefined) {
            return state;
        }
        player.avatarName = action.avatarName;
        if (action.log) {
            store.log(state, action.log.message, action.log.params, player.id);
        }
        return state;
    }
    return state;
}
exports.playerStateReducer = playerStateReducer;
