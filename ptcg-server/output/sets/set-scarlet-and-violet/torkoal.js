"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Torkoal = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Torkoal extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Stampede',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }, {
                name: 'Concentrated Fire',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                damageCalculation: 'x',
                text: 'Flip a coin for each [R] Energy attached to this Pokémon. This attack does 80 damage for each heads.'
            }];
        this.set = 'SVI';
        this.name = 'Torkoal';
        this.fullName = 'Torkoal SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
        this.regulationMark = 'G';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // Check attached energy
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkEnergy);
            const totalEnergy = checkEnergy.energyMap.reduce((sum, energy) => {
                return sum + energy.provides.filter(p => p === card_types_1.CardType.FIRE || p === card_types_1.CardType.ANY || p === card_types_1.CardType.GRW || p === card_types_1.CardType.GRPD).length;
            }, 0);
            effect.damage = 0;
            for (let i = 0; i < totalEnergy; i++) {
                store.prompt(state, [
                    new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
                ], result => {
                    if (result === true) {
                        effect.damage += 80;
                    }
                });
            }
        }
        return state;
    }
}
exports.Torkoal = Torkoal;
