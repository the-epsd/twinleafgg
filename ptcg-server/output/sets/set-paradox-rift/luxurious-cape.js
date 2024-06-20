"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuxuriousCape = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class LuxuriousCape extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'G';
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '166';
        this.name = 'Luxurious Cape';
        this.fullName = 'Luxurious Cape PAR';
        this.text = 'If the Pokémon this card is attached to doesn\'t have a Rule Box, it gets +100 HP, and if it is Knocked Out by damage from an attack from your opponent\'s Pokémon, that player takes 1 more Prize card. (Pokémon ex, Pokémon V, etc. have Rule Boxes.)';
        this.damageDealt = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.tool === this) {
            this.damageDealt = false;
        }
        if ((effect instanceof attack_effects_1.DealDamageEffect || effect instanceof attack_effects_1.PutDamageEffect) &&
            effect.target.tool === this) {
            const player = game_1.StateUtils.getOpponent(state, effect.player);
            if (player.active.tool === this) {
                this.damageDealt = true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player === game_1.StateUtils.getOpponent(state, effect.player)) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner === effect.player) {
                this.damageDealt = false;
            }
        }
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_a) {
                return state;
            }
            if (effect.target.tool instanceof LuxuriousCape) {
                if (effect.target.hasRuleBox()) {
                    return state;
                }
                effect.hp += 100;
            }
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_b) {
                return state;
            }
            if (!effect.target.hasRuleBox() && this.damageDealt) {
                effect.prizeCount += 1;
            }
            return state;
        }
        return state;
    }
}
exports.LuxuriousCape = LuxuriousCape;
