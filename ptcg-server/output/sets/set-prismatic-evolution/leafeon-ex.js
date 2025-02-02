"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leafeonex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Leafeonex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = G;
        this.hp = 270;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Leaf Typhoon',
                cost: [G, C],
                damage: 60,
                text: 'This attack foes 60 damage for each Energy attached to all of your opponent\'s Pokémon.'
            },
            {
                name: 'Moss Agate',
                cost: [G, R, W],
                damage: 230,
                text: 'Heal 100 damage from each of your Benched Pokemon.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'PRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Leafeon ex';
        this.fullName = 'Leafeon ex SV8a';
    }
    reduceEffect(store, state, effect) {
        // Psybeam
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energies = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach(energy => {
                    energies++;
                });
            });
            effect.damage = energies * 60;
        }
        // Psychic
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, 100);
                healTargetEffect.target = cardList;
                state = store.reduceEffect(state, healTargetEffect);
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            // Target is this Pokemon
            if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Leafeonex = Leafeonex;
