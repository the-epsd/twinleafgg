"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlolanDugtrio = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class AlolanDugtrio extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Alolan Diglett';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Trio-Cheehoo',
                cost: [],
                damage: 120,
                text: 'If you don\'t have exactly 3 cards in your hand, this attack does nothing.'
            }
        ];
        this.set = 'SSP';
        this.setNumber = '123';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Alolan Dugtrio';
        this.fullName = 'Alolan Dugtrio SSP';
    }
    reduceEffect(store, state, effect) {
        // Trio-Cheehoo
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.hand.cards.length != 3) {
                effect.damage = 0;
            }
        }
        return state;
    }
}
exports.AlolanDugtrio = AlolanDugtrio;
