"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianArcanine = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
// LOR Hisuian Arcanine 84 (https://limitlesstcg.com/cards/LOR/84)
class HisuianArcanine extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Hisuian Growlithe';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Very Vulnerable',
                cost: [],
                damage: 10,
                text: 'If you have no cards in your hand, this attack does 150 more damage.'
            },
            {
                name: 'Sharp Fang',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: ''
            }
        ];
        this.set = 'LOR';
        this.name = 'Hisuian Arcanine';
        this.fullName = 'Hisuian Arcanine LOR';
        this.setNumber = '84';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Very Vulnerable
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.hand.cards.length === 0) {
                effect.damage += 150;
            }
        }
        return state;
    }
}
exports.HisuianArcanine = HisuianArcanine;
