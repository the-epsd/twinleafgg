"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pyroar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_message_1 = require("../../game/game-message");
const check_effects_1 = require("../../game/store/effects/check-effects");
const choose_energy_prompt_1 = require("../../game/store/prompts/choose-energy-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Pyroar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Litleo';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Intimidating Mane',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Prevent all damage done to this Pokemon by attacks from your ' +
                    'opponent\'s Basic Pokemon.'
            }];
        this.attacks = [{
                name: 'Scorching Fang',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'You may discard a R Energy attached to this Pokemon. If you do, ' +
                    'this attack does 30 more damage.'
            }];
        this.set = 'FLF';
        this.name = 'Pyroar';
        this.fullName = 'Pyroar FLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new choose_energy_prompt_1.ChooseEnergyPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.FIRE], { allowCancel: true }), energy => {
                const cards = (energy || []).map(e => e.card);
                if (cards.length > 0) {
                    effect.damage += 30;
                    const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                    discardEnergy.target = player.active;
                    return store.reduceEffect(state, discardEnergy);
                }
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            // It's not this pokemon card
            if (pokemonCard !== this) {
                return state;
            }
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK || !effect.source.isBasic()) {
                return state;
            }
            const player = state_utils_1.StateUtils.findOwner(state, effect.target);
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.Pyroar = Pyroar;
