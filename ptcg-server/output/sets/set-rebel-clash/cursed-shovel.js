"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursedShovel = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class CursedShovel extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'D';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'RCL';
        this.name = 'Cursed Shovel';
        this.fullName = 'Cursed Shovel RCL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '157';
        this.text = 'If the Pokémon this card is attached to is Knocked Out by damage from an opponent\'s attack, discard the top 2 cards of your opponent\'s deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_a) {
                return state;
            }
            opponent.deck.moveTo(opponent.discard, 2);
        }
        return state;
    }
}
exports.CursedShovel = CursedShovel;
