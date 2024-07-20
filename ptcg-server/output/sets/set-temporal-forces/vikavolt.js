"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vikavolt = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Vikavolt extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Charjabug';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 160;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Mach Bolt',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 50,
                text: ''
            },
            {
                name: 'Serial Cannon',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING],
                damage: 120,
                damageCalculation: '+',
                text: 'This attack does 80 more damage for each of your Benched Vikavolt.'
            }
        ];
        this.set = 'TEF';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
        this.name = 'Vikavolt';
        this.fullName = 'Vikavolt TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let charjabugInPlay = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (card.name === 'Charjabug') {
                    charjabugInPlay++;
                }
            });
            effect.damage += 80 * charjabugInPlay;
        }
        return state;
    }
}
exports.Vikavolt = Vikavolt;
