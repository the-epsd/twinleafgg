"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flittle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Flittle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Psychic',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 10 more damage for each Energy attached to your opponent\'s Active Pokémon.'
            }];
        this.set = 'PAR';
        this.regulationMark = 'G';
        this.setNumber = '80';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Flittle';
        this.fullName = 'Flittle PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActivePokemon = opponent.active;
            let energyCount = 0;
            opponentActivePokemon.cards.forEach(c => {
                if (c instanceof game_1.EnergyCard) {
                    energyCount++;
                }
            });
            effect.damage += energyCount * 10;
        }
        return state;
    }
}
exports.Flittle = Flittle;
