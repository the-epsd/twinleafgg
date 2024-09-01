"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magmar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Magmar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Live Coal',
                cost: [card_types_1.CardType.FIRE],
                damage: 10,
                text: ''
            }, {
                name: 'Flare Combo',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 80,
                damageCalculation: '+',
                text: 'If Electabuzz is on your Bench, this attack does 80 more damage.'
            }];
        this.set = 'MEW';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '126';
        this.name = 'Magmar';
        this.fullName = 'Magmar MEW';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let isElectabuzzInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Electabuzz') {
                    isElectabuzzInPlay = true;
                }
            });
            if (isElectabuzzInPlay) {
                effect.damage += 80;
            }
            return state;
        }
        return state;
    }
}
exports.Magmar = Magmar;
