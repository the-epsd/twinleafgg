"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FroakieFrubbles = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_2 = require("../../game/store/effects/check-effects");
// FLI Froakie 21 (https://limitlesstcg.com/cards/FLI/21)
class FroakieFrubbles extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Frubbles',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon has any [W] Energy attached to it, it has no Retreat Cost.'
            }];
        this.attacks = [
            { name: 'Flop', cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], damage: 20, text: '' }
        ];
        this.set = 'FLI';
        this.setNumber = '21';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Froakie';
        this.fullName = 'Froakie FLI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_2.CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
            const player = effect.player;
            // checking if this thing is in the active because we ain't trusting the conditions
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            // checking for the water energies
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            let waterCheck = false;
            checkProvidedEnergy.energyMap.forEach(em => {
                if (em.provides.includes(card_types_1.CardType.WATER)) {
                    waterCheck = true;
                }
            });
            if (waterCheck) {
                effect.cost = [];
            }
        }
        return state;
    }
}
exports.FroakieFrubbles = FroakieFrubbles;
