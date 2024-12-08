"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tinkatuff = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
class Tinkatuff extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Alloy Swing',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 20,
                damageCalculation: '+',
                text: 'If this Pokémon has any [M] Energy attached, this attack does 40 more damage.'
            }
        ];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
        this.name = 'Tinkatuff';
        this.fullName = 'Tinkatuff PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const pokemon = player.active;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, pokemon);
            store.reduceEffect(state, checkEnergy);
            let damage = 20;
            checkEnergy.energyMap.forEach(em => {
                var _a;
                const energyCard = em.card;
                if (energyCard instanceof game_1.EnergyCard &&
                    (energyCard.provides.includes(card_types_1.CardType.METAL) ||
                        energyCard.provides.includes(card_types_1.CardType.ANY) ||
                        ((_a = energyCard.blendedEnergies) === null || _a === void 0 ? void 0 : _a.includes(card_types_1.CardType.METAL)))) {
                    damage += 40;
                }
            });
            effect.damage = damage;
        }
        return state;
    }
}
exports.Tinkatuff = Tinkatuff;
