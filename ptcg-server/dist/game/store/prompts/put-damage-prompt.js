import { Prompt } from './prompt';
import { PlayerType } from '../actions/play-card-action';
import { StateUtils } from '../state-utils';
export const PutDamagePromptType = 'Put damage';
export class PutDamagePrompt extends Prompt {
    constructor(playerId, message, playerType, slots, damage, maxAllowedDamage, options) {
        super(playerId);
        this.message = message;
        this.playerType = playerType;
        this.slots = slots;
        this.damage = damage;
        this.maxAllowedDamage = maxAllowedDamage;
        this.type = PutDamagePromptType;
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
        const blocked = this.options.blocked.map(b => StateUtils.getTarget(state, player, b));
        for (const r of result) {
            const target = StateUtils.getTarget(state, player, r.target);
            if (target === undefined || blocked.includes(target)) {
                return false;
            }
        }
        if (this.playerType !== PlayerType.ANY) {
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
