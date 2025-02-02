"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Electabuzz = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Electabuzz extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Electro Combo',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 10,
                text: 'If Magmar is on your Bench, this attack does 40 more damage.'
            }, {
                name: 'Light Punch',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }];
        this.set = 'MEW';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '125';
        this.name = 'Electabuzz';
        this.fullName = 'Electabuzz MEW';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let isMagmarInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Magmar') {
                    isMagmarInPlay = true;
                }
            });
            if (isMagmarInPlay) {
                effect.damage += 40;
            }
            return state;
        }
        return state;
    }
}
exports.Electabuzz = Electabuzz;
