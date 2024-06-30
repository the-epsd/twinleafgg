"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptSerializer = void 0;
const game_error_1 = require("../game-error");
const game_message_1 = require("../game-message");
const alert_prompt_1 = require("../store/prompts/alert-prompt");
const attach_energy_prompt_1 = require("../store/prompts/attach-energy-prompt");
const choose_attack_prompt_1 = require("../store/prompts/choose-attack-prompt");
const choose_cards_prompt_1 = require("../store/prompts/choose-cards-prompt");
const choose_energy_prompt_1 = require("../store/prompts/choose-energy-prompt");
const choose_pokemon_prompt_1 = require("../store/prompts/choose-pokemon-prompt");
const choose_prize_prompt_1 = require("../store/prompts/choose-prize-prompt");
const coin_flip_prompt_1 = require("../store/prompts/coin-flip-prompt");
const confirm_prompt_1 = require("../store/prompts/confirm-prompt");
const invite_player_prompt_1 = require("../store/prompts/invite-player-prompt");
const move_damage_prompt_1 = require("../store/prompts/move-damage-prompt");
const move_energy_prompt_1 = require("../store/prompts/move-energy-prompt");
const order_cards_prompt_1 = require("../store/prompts/order-cards-prompt");
const put_damage_prompt_1 = require("../store/prompts/put-damage-prompt");
const select_prompt_1 = require("../store/prompts/select-prompt");
const show_cards_prompt_1 = require("../store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../store/prompts/shuffle-prompt");
const shuffle_hand_prompt_1 = require("../store/prompts/shuffle-hand-prompt");
const remove_damage_prompt_1 = require("../store/prompts/remove-damage-prompt");
const discard_energy_prompt_1 = require("../store/prompts/discard-energy-prompt");
const confirm_cards_prompt_1 = require("../store/prompts/confirm-cards-prompt");
class PromptSerializer {
    constructor() {
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
        this.types = this.rows.map(p => p.type);
        this.classes = this.rows.map(p => p.classValue);
    }
    serialize(prompt) {
        const data = Object.assign({}, prompt);
        const row = this.rows.find(r => prompt instanceof r.classValue);
        if (row === undefined) {
            throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, `Unknown prompt type '${prompt.type}'.`);
        }
        return Object.assign(Object.assign({}, data), { _type: row.type });
    }
    deserialize(data, context) {
        const row = this.rows.find(p => p.type === data._type);
        if (row === undefined) {
            throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, `Unknown prompt type '${data._type}'.`);
        }
        const prompt = Object.create(row.classValue.prototype);
        delete data._type;
        return Object.assign(prompt, data);
    }
}
exports.PromptSerializer = PromptSerializer;
