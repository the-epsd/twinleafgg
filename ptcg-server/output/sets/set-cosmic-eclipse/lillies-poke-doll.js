"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LilliesPokeDoll = void 0;
const __1 = require("../..");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class LilliesPokeDoll extends __1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.NONE;
        this.hp = 10;
        this.weakness = [];
        this.retreat = [];
        this.attacks = [];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '197';
        this.name = 'Lillie\'s Poké Doll';
        this.fullName = 'Lillie\'s Poké Doll CEC';
        this.text = 'Play this card as if it were a 30-HP [C] Basic Pokémon. At any time during your turn (before your attack), if this Pokémon is your Active Pokémon, you may discard all cards from it and put it on the bottom of your deck.' +
            '' +
            'This card can\'t retreat. If this card is Knocked Out, your opponent can\'t take any Prize cards for it.';
    }
    reduceEffect(store, state, effect) {
        this.superType = card_types_1.SuperType.TRAINER;
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.cards.includes(this)) {
            throw new __1.GameError(__1.GameMessage.CANNOT_RETREAT);
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this)) {
            effect.prizeCount = 0;
            return state;
        }
        return state;
    }
}
exports.LilliesPokeDoll = LilliesPokeDoll;
