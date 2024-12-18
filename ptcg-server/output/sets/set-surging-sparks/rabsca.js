"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rabsca = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Rabsca extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rellor';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Triple Draw', cost: [card_types_1.CardType.COLORLESS], damage: 0, text: 'Draw 3 cards.' },
            { name: 'Counterturn', cost: [card_types_1.CardType.GRASS], damage: 40, text: 'If there are 3 or fewer cards in your deck, this attack does 200 more damage.' }
        ];
        this.set = 'SSP';
        this.name = 'Rabsca';
        this.fullName = 'Rabsca SSP';
        this.setNumber = '14';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Triple Draw
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.deck.moveTo(player.hand, 3);
        }
        // Counterturn
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.deck.cards.length <= 3) {
                effect.damage += 200;
            }
        }
        return state;
    }
}
exports.Rabsca = Rabsca;
