"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SandyShocks = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
class SandyShocks extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.tags = [card_types_1.CardTag.ANCIENT];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Magnetic Burst',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 20,
                damageCalculation: '+',
                text: 'If you have 3 or more Energy in play, this attack does 70 more damage. This attack\'s damage isn\'t affected by Weakness.'
            },
            {
                name: 'Power Gem',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '98';
        this.name = 'Sandy Shocks';
        this.fullName = 'Sandy Shocks TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            effect.ignoreWeakness = true;
            let energyCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach(energy => {
                    energyCount += energy.provides.length;
                });
            });
            if (energyCount >= 3) {
                effect.damage += 70;
            }
        }
        return state;
    }
}
exports.SandyShocks = SandyShocks;
