"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhanpyVIV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class PhanpyVIV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Stampede',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 10,
                text: ''
            },
            {
                name: 'Strike Back',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'This attack does 30 damage for each damage counter on this Pokémon.'
            },
        ];
        this.set = 'VIV';
        this.name = 'Phanpy';
        this.fullName = 'Phanpy VIV';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
    }
    reduceEffect(store, state, effect) {
        // Strike Back
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            effect.damage += player.active.damage * 3;
        }
        return state;
    }
}
exports.PhanpyVIV = PhanpyVIV;
