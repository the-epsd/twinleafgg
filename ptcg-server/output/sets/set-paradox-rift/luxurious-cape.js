"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuxuriousCape = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
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
    }
    // public damageDealt = false;
    reduceEffect(store, state, effect) {
        // if (effect instanceof AttackEffect && effect.player.active.tool === this) {
        //   this.damageDealt = false;
        // }
        // if ((effect instanceof DealDamageEffect || effect instanceof PutDamageEffect) &&
        //     effect.target.tool === this) {
        //   const player = StateUtils.getOpponent(state, effect.player);
        //   if (player.active.tool === this) {
        //     this.damageDealt = true;
        //   }
        // }
        // if (effect instanceof EndTurnEffect && effect.player === StateUtils.getOpponent(state, effect.player)) {
        //   const cardList = StateUtils.findCardList(state, this);
        //   const owner = StateUtils.findOwner(state, cardList);
        //   if (owner === effect.player) {
        //     this.damageDealt = false;
        //   }
        // }
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_a) {
                return state;
            }
            if (!effect.target.hasRuleBox()) {
                effect.hp += 100;
            }
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
            const player = effect.player;
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_b) {
                return state;
            }
            if (!effect.target.hasRuleBox()) {
                effect.prizeCount += 1;
            }
            return state;
        }
        return state;
    }
}
exports.LuxuriousCape = LuxuriousCape;
