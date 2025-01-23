"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IonosVoltorb = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class IonosVoltorb extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.IONOS];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Chain Bolt',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 20 more damage for each [L] Energy attached to your Iono\'s Pokémon.'
            }
        ];
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.set = 'SV9';
        this.setNumber = '26';
        this.name = 'Iono\'s Voltorb';
        this.fullName = 'Iono\'s Voltorb SV9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let energies = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.tags.includes(card_types_1.CardTag.IONOS)) {
                    const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                    store.reduceEffect(state, checkProvidedEnergyEffect);
                    checkProvidedEnergyEffect.energyMap.forEach(energy => {
                        if (energy.provides.includes(card_types_1.CardType.LIGHTNING) || energy.provides.includes(card_types_1.CardType.ANY)) {
                            energies++;
                        }
                    });
                }
            });
            effect.damage += energies * 20;
        }
        return state;
    }
}
exports.IonosVoltorb = IonosVoltorb;
