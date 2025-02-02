"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PutDamagePrompt = exports.PutDamagePromptType = void 0;
const prompt_1 = require("./prompt");
const play_card_action_1 = require("../actions/play-card-action");
const state_utils_1 = require("../state-utils");
exports.PutDamagePromptType = 'Put damage';
class PutDamagePrompt extends prompt_1.Prompt {
    constructor(playerId, message, playerType, slots, damage, maxAllowedDamage, options) {
        super(playerId);
        this.message = message;
        this.playerType = playerType;
        this.slots = slots;
        this.damage = damage;
        this.maxAllowedDamage = maxAllowedDamage;
        this.type = exports.PutDamagePromptType;
        // Default options
        this.options = Object.assign({}, {
            allowCancel: true,
            blocked: [],
            allowPlacePartialDamage: false,
            damageMultiple: 10,
        }, options);
    }
    decode(result, state) {
        return result;
    }
    validate(result, state) {
        if (result === null) {
            return this.options.allowCancel; // operation cancelled
        }
        let damage = 0;
        result.forEach(r => { damage += r.damage; });
        if (this.damage !== damage && !this.options.allowPlacePartialDamage) {
            return false;
        }
        const player = state.players.find(p => p.id === this.playerId);
        if (player === undefined) {
            return false;
        }
        const blocked = this.options.blocked.map(b => state_utils_1.StateUtils.getTarget(state, player, b));
        for (const r of result) {
            const target = state_utils_1.StateUtils.getTarget(state, player, r.target);
            if (target === undefined || blocked.includes(target)) {
                return false;
            }
        }
        if (this.playerType !== play_card_action_1.PlayerType.ANY) {
            if (result.some(r => r.target.player !== this.playerType)) {
                return false;
            }
        }
        if (result.some(r => !this.slots.includes(r.target.slot))) {
            return false;
        }
        return true;
    }
}
exports.PutDamagePrompt = PutDamagePrompt;
