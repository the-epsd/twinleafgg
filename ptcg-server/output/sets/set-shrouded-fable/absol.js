"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Absol = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Absol extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Bad Fall',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                damageCalculation: '+',
                text: 'If you have at least 3 [D] Energy in play, this attack does 50 more damage.'
            }
        ];
        this.set = 'SFA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '30';
        this.name = 'Absol';
        this.fullName = 'Absol SFA';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let energyCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                cardList.cards.forEach(card => {
                    if (card instanceof game_1.EnergyCard) {
                        if (card.provides.includes(card_types_1.CardType.DARK) || card.provides.includes(card_types_1.CardType.ANY)) {
                            energyCount += 1;
                        }
                        else if (card.blendedEnergies.includes(card_types_1.CardType.DARK)) {
                            energyCount += 1;
                        }
                    }
                });
            });
            if (energyCount >= 3)
                effect.damage += 50;
            return state;
        }
        return state;
    }
}
exports.Absol = Absol;
