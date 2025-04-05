"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MRayquazaEX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class MRayquazaEX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.MEGA;
        this.tags = [card_types_1.CardTag.POKEMON_EX, card_types_1.CardTag.MEGA];
        this.evolvesFrom = 'Rayquaza EX';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 230;
        this.weakness = [{ type: card_types_1.CardType.FAIRY }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Delta Wild',
                powerType: pokemon_types_1.PowerType.ANCIENT_TRAIT,
                text: 'Any damage done to this Pokémon by attacks from your opponent\'s Grass, Fire, Water, or Lightning Pokémon is reduced by 20 (after applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Dragon Ascent',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 300,
                text: 'Discard 2 Energy attached to this Pokémon.'
            }
        ];
        this.set = 'ROS';
        this.name = 'M Rayquaza EX';
        this.fullName = 'M Rayquaza EX ROS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
    }
    reduceEffect(store, state, effect) {
        if ((effect instanceof game_effects_1.EvolveEffect) && effect.pokemonCard === this) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this && cardList.tool && cardList.tool.name === 'Rayquaza Spirit Link') {
                    return state;
                }
                else {
                    const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                    store.reduceEffect(state, endTurnEffect);
                    return state;
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
        }
        // Delta Plus
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ANCIENT_TRAIT,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            if (effect.target.cards.includes(this)) {
                const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.source);
                store.reduceEffect(state, checkPokemonType);
                if (checkPokemonType.cardTypes.includes(card_types_1.CardType.GRASS) ||
                    checkPokemonType.cardTypes.includes(card_types_1.CardType.FIRE) ||
                    checkPokemonType.cardTypes.includes(card_types_1.CardType.WATER) ||
                    checkPokemonType.cardTypes.includes(card_types_1.CardType.LIGHTNING)) {
                    effect.damage -= 20;
                }
            }
        }
        return state;
    }
}
exports.MRayquazaEX = MRayquazaEX;
