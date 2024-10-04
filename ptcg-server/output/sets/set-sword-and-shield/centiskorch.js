"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Centiskorch = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Centiskorch extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sizzlipede';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 130;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Hundred Foot Flames',
                cost: [card_types_1.CardType.FIRE],
                damage: 0,
                text: 'For each [R] Energy attached to this Pokémon, discard the top card of your opponent\'s deck.'
            },
            {
                name: 'Searing Flame',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 110,
                text: 'Your opponent\'s Active Pokemon is now Burned.'
            }];
        this.set = 'SSH';
        this.regulationMark = 'D';
        this.setNumber = '88';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Centiskorch';
        this.fullName = 'Centiskorch SSH';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => cardType === card_types_1.CardType.FIRE || cardType === card_types_1.CardType.ANY).length;
            });
            opponent.deck.moveTo(opponent.discard, energyCount);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.BURNED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Centiskorch = Centiskorch;
