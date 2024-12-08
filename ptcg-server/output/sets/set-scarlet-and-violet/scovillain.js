"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scovillain = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Scovillain extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Capsakid';
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Hot Bite',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Your opponent\'s Active Pokémon is now Burned.'
            },
            {
                name: 'Super Spicy Breath',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                damageCalculation: '+',
                text: 'If this Pokémon has any [R] Energy attached, this attack does 90 more damage.'
            }
        ];
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '29';
        this.name = 'Scovillain';
        this.fullName = 'Scovillain SVI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.BURNED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const pokemon = player.active;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, pokemon);
            store.reduceEffect(state, checkEnergy);
            let damage = 90;
            checkEnergy.energyMap.forEach(em => {
                var _a;
                const energyCard = em.card;
                if (energyCard instanceof game_1.EnergyCard &&
                    (energyCard.provides.includes(card_types_1.CardType.FIRE) ||
                        energyCard.provides.includes(card_types_1.CardType.ANY) ||
                        ((_a = energyCard.blendedEnergies) === null || _a === void 0 ? void 0 : _a.includes(card_types_1.CardType.FIRE)))) {
                    damage += 90;
                }
            });
            effect.damage = damage;
        }
        return state;
    }
}
exports.Scovillain = Scovillain;
