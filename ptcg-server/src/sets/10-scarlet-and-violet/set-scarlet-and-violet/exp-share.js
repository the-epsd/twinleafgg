"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.ExpShare = void 0;
var game_message_1 = require("../../game/game-message");
var trainer_card_1 = require("../../game/store/card/trainer-card");
var card_types_1 = require("../../game/store/card/card-types");
var state_1 = require("../../game/store/state/state");
var game_effects_1 = require("../../game/store/effects/game-effects");
var attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
var play_card_action_1 = require("../../game/store/actions/play-card-action");
var state_utils_1 = require("../../game/store/state-utils");
var pokemon_card_list_1 = require("../../game/store/state/pokemon-card-list");
var prefabs_1 = require("../../game/store/prefabs/prefabs");
var ExpShare = /** @class */ (function (_super) {
    __extends(ExpShare, _super);
    function ExpShare() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.regulationMark = 'G';
        _this.trainerType = card_types_1.TrainerType.TOOL;
        _this.set = 'SVI';
        _this.cardImage = 'assets/cardback.png';
        _this.setNumber = '174';
        _this.name = 'Exp. Share';
        _this.fullName = 'Exp. Share SVI';
        _this.text = 'When your Active Pokemon is Knocked Out by damage from an opponent\'s ' +
            'attack, you may move 1 basic Energy card that was attached to that ' +
            'Pokemon to the Pokemon this card is attached to.';
        _this.EXP_SHARE_MARKER = 'EXP_SHARE_MARKER';
        return _this;
    }
    ExpShare.prototype.reduceEffect = function (store, state, effect) {
        var _this = this;
        // Only process the effect when it's a KnockOutEffect and the target is the player's active
        if (!(effect instanceof game_effects_1.KnockOutEffect) || effect.target !== effect.player.active) {
            return state;
        }
        var player = effect.player;
        var opponent = state_utils_1.StateUtils.getOpponent(state, player);
        var active = effect.target;
        if (prefabs_1.IS_TOOL_BLOCKED(store, state, player, this)) {
            return state;
        }
        // Do not activate between turns, or when it's not opponents turn.
        if (state.phase !== state_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
            return state;
        }
        if (active.marker.hasMarker(this.EXP_SHARE_MARKER)) {
            return state;
        }
        var expShareCount = 0;
        var blockedTo = [];
        player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, function (cardList, card, target) {
            if (cardList === effect.target) {
                return;
            }
            if (cardList.tool instanceof ExpShare) {
                expShareCount++;
            }
            else {
                blockedTo.push(target);
            }
        });
        if (expShareCount === 0) {
            return state;
        }
        // Add marker, do not invoke this effect for other exp. share
        active.marker.addMarker(this.EXP_SHARE_MARKER, this);
        // Make copy of the active pokemon cards,
        // because they will be transfered to discard shortly
        var activeCopy = new pokemon_card_list_1.PokemonCardList();
        activeCopy.cards = player.active.cards.slice();
        state = store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, activeCopy, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: true, min: 1, max: expShareCount, differentTargets: true, blockedTo: blockedTo }), function (transfers) {
            transfers = transfers || [];
            active.marker.removeMarker(_this.EXP_SHARE_MARKER);
            for (var _i = 0, transfers_1 = transfers; _i < transfers_1.length; _i++) {
                var transfer = transfers_1[_i];
                var target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                player.discard.moveCardTo(transfer.card, target);
            }
        });
        return state;
    };
    return ExpShare;
}(trainer_card_1.TrainerCard));
exports.ExpShare = ExpShare;
