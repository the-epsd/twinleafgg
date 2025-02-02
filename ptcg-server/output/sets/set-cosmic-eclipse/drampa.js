"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drampa = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Drampa extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 130;
        this.weakness = [{ type: Y }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Dragon Claw',
                cost: [C],
                damage: 20,
                text: ''
            },
            {
                name: 'Dragon Arcana',
                cost: [C, C, C],
                damage: 70,
                damageCalculation: '+',
                text: 'If this Pokémon has 2 or more different types of basic Energy attached to it, this attack does 70 more damage.'
            },
        ];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '159';
        this.name = 'Drampa';
        this.fullName = 'Drampa CEC';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const attachedEnergyTypes = new Set();
            player.active.cards.forEach(card => {
                if (card instanceof game_1.EnergyCard && card.provides) {
                    card.provides.forEach(energyType => {
                        if (energyType !== card_types_1.CardType.COLORLESS && energyType !== card_types_1.CardType.ANY) {
                            attachedEnergyTypes.add(energyType);
                        }
                    });
                }
            });
            if (attachedEnergyTypes.size >= 2) {
                effect.damage += 70;
            }
        }
        return state;
    }
}
exports.Drampa = Drampa;
