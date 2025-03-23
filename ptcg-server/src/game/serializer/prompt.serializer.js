"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.PromptSerializer = void 0;
var game_error_1 = require("../game-error");
var game_message_1 = require("../game-message");
var alert_prompt_1 = require("../store/prompts/alert-prompt");
var attach_energy_prompt_1 = require("../store/prompts/attach-energy-prompt");
var choose_attack_prompt_1 = require("../store/prompts/choose-attack-prompt");
var choose_cards_prompt_1 = require("../store/prompts/choose-cards-prompt");
var choose_energy_prompt_1 = require("../store/prompts/choose-energy-prompt");
var choose_pokemon_prompt_1 = require("../store/prompts/choose-pokemon-prompt");
var choose_prize_prompt_1 = require("../store/prompts/choose-prize-prompt");
var coin_flip_prompt_1 = require("../store/prompts/coin-flip-prompt");
var confirm_prompt_1 = require("../store/prompts/confirm-prompt");
var invite_player_prompt_1 = require("../store/prompts/invite-player-prompt");
var move_damage_prompt_1 = require("../store/prompts/move-damage-prompt");
var move_energy_prompt_1 = require("../store/prompts/move-energy-prompt");
var order_cards_prompt_1 = require("../store/prompts/order-cards-prompt");
var put_damage_prompt_1 = require("../store/prompts/put-damage-prompt");
var select_prompt_1 = require("../store/prompts/select-prompt");
var show_cards_prompt_1 = require("../store/prompts/show-cards-prompt");
var shuffle_prompt_1 = require("../store/prompts/shuffle-prompt");
var shuffle_hand_prompt_1 = require("../store/prompts/shuffle-hand-prompt");
var remove_damage_prompt_1 = require("../store/prompts/remove-damage-prompt");
var discard_energy_prompt_1 = require("../store/prompts/discard-energy-prompt");
var confirm_cards_prompt_1 = require("../store/prompts/confirm-cards-prompt");
var PromptSerializer = /** @class */ (function () {
    function PromptSerializer() {
        this.rows = [
            { classValue: alert_prompt_1.AlertPrompt, type: 'AlertPrompt' },
            { classValue: attach_energy_prompt_1.AttachEnergyPrompt, type: 'AttachEnergyPrompt' },
            { classValue: choose_attack_prompt_1.ChooseAttackPrompt, type: 'ChooseAttackPrompt' },
            { classValue: choose_cards_prompt_1.ChooseCardsPrompt, type: 'ChooseCardsPrompt' },
            { classValue: choose_energy_prompt_1.ChooseEnergyPrompt, type: 'ChooseEnergyPrompt' },
            { classValue: choose_pokemon_prompt_1.ChoosePokemonPrompt, type: 'ChoosePokemonPrompt' },
            { classValue: choose_prize_prompt_1.ChoosePrizePrompt, type: 'ChoosePrizePrompt' },
            { classValue: coin_flip_prompt_1.CoinFlipPrompt, type: 'CoinFlipPrompt' },
            { classValue: confirm_prompt_1.ConfirmPrompt, type: 'ConfirmPrompt' },
            { classValue: invite_player_prompt_1.InvitePlayerPrompt, type: 'InvitePlayerPrompt' },
            { classValue: move_damage_prompt_1.MoveDamagePrompt, type: 'MoveDamagePrompt' },
            { classValue: move_energy_prompt_1.MoveEnergyPrompt, type: 'MoveEnergyPrompt' },
            { classValue: order_cards_prompt_1.OrderCardsPrompt, type: 'OrderCardsPrompt' },
            { classValue: put_damage_prompt_1.PutDamagePrompt, type: 'PutDamagePrompt' },
            { classValue: select_prompt_1.SelectPrompt, type: 'SelectPrompt' },
            { classValue: show_cards_prompt_1.ShowCardsPrompt, type: 'ShowCardsPrompt' },
            { classValue: shuffle_prompt_1.ShuffleDeckPrompt, type: 'ShuffleDeckPrompt' },
            { classValue: shuffle_hand_prompt_1.ShuffleHandPrompt, type: 'ShuffleHandPrompt' },
            { classValue: remove_damage_prompt_1.RemoveDamagePrompt, type: 'RemoveDamagePrompt' },
            { classValue: discard_energy_prompt_1.DiscardEnergyPrompt, type: 'DiscardEnergyPrompt' },
            { classValue: confirm_cards_prompt_1.ConfirmCardsPrompt, type: 'ConfirmCardsPrompt' },
        ];
        this.types = this.rows.map(function (p) { return p.type; });
        this.classes = this.rows.map(function (p) { return p.classValue; });
    }
    PromptSerializer.prototype.serialize = function (prompt) {
        var data = __assign({}, prompt);
        var row = this.rows.find(function (r) { return prompt instanceof r.classValue; });
        if (row === undefined) {
            throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, "Unknown prompt type '" + prompt.type + "'.");
        }
        return __assign(__assign({}, data), { _type: row.type });
    };
    PromptSerializer.prototype.deserialize = function (data, context) {
        var row = this.rows.find(function (p) { return p.type === data._type; });
        if (row === undefined) {
            throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, "Unknown prompt type '" + data._type + "'.");
        }
        var prompt = Object.create(row.classValue.prototype);
        delete data._type;
        return Object.assign(prompt, data);
    };
    return PromptSerializer;
}());
exports.PromptSerializer = PromptSerializer;
