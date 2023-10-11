"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NecrozmaV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
class NecrozmaV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'E';
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 220;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Prismatic Ray',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 30,
                text: 'This attack also does 20 damage to 2 of your opponent’s ' +
                    'Benched Pokémon. (Don’t apply Weakness and Resistance ' +
                    'for Benched Pokémon.) '
            },
            {
                name: 'Special Laser',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: 'If this Pokémon has any Special Energy attached, this ' +
                    'attack does 120 more damage. '
            }
        ];
        this.set = 'BST';
        this.set2 = 'battlestyles';
        this.setNumber = '63';
        this.name = 'Necrozma V';
        this.fullName = 'Necrozma V BST 063';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const pokemon = player.active;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, pokemon);
            store.reduceEffect(state, checkEnergy);
            let damage = 100;
            checkEnergy.energyMap.forEach(em => {
                const energyCard = em.card;
                if (energyCard instanceof game_1.EnergyCard && energyCard.energyType === card_types_1.EnergyType.SPECIAL) {
                    damage += 120;
                }
            });
            effect.damage = damage;
        }
        return state;
    }
}
exports.NecrozmaV = NecrozmaV;
