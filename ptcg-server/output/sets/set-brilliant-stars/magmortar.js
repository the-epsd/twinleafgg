"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magmortar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Magmortar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Magmar';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 140;
        this.weakness = [{
                type: card_types_1.CardType.WATER
            }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Mega Punch',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }, {
                name: 'Boltsplosion',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 120,
                damageCalculation: '+',
                text: 'If Electivire is on your Bench, this attack does 120 more damage.'
            }];
        this.set = 'BRS';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Magmortar';
        this.fullName = 'Magmortar BRS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let isElectivireInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Electivire') {
                    isElectivireInPlay = true;
                }
            });
            if (isElectivireInPlay) {
                effect.damage += 120;
            }
            return state;
        }
        return state;
    }
}
exports.Magmortar = Magmortar;
