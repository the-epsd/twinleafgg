"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regirock = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Regirock extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 130;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Metal Shield',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon has any Energy attached, it takes 30 less damage from attacks (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Buster Lariat',
                cost: [F, F, F],
                damage: 120,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            }];
        this.set = 'JTG';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '82';
        this.name = 'Regirock';
        this.fullName = 'Regirock JTG';
    }
    reduceEffect(store, state, effect) {
        // Reduce damage by 30
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const player = game_1.StateUtils.findOwner(state, effect.target);
            // It's not this pokemon card
            if (pokemonCard !== this || state.phase !== game_1.GamePhase.ATTACK || prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this))
                return state;
            // Check attached energy 
            // Check attached energy 
            const cardList = game_1.StateUtils.findCardList(state, this);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
            state = store.reduceEffect(state, checkProvidedEnergy);
            if (checkProvidedEnergy.energyMap.length > 0)
                effect.damage = Math.max(0, effect.damage - 30);
            return state;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this))
            effect.ignoreResistance = true;
        return state;
    }
}
exports.Regirock = Regirock;
