"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gothitelle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Gothitelle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gothorita';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Magic Room',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'As long as this Pokemon is your Active Pokemon, your opponent ' +
                    'can\'t play any Item cards from his or her hand.'
            }];
        this.attacks = [{
                name: 'Madkinesis',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Does 20 more damage for each P Energy attached to this Pokemon.'
            }];
        this.set = 'LTR';
        this.name = 'Gothitelle';
        this.fullName = 'Gothitelle LTR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '72';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let psychicEnergies = 0;
            checkProvidedEnergyEffect.energyMap.forEach(energy => {
                energy.provides.forEach(c => {
                    psychicEnergies += c === card_types_1.CardType.PSYCHIC ? 1 : 0;
                });
            });
            effect.damage += 20 * psychicEnergies;
            return state;
        }
        // Block trainer cards
        if (effect instanceof play_card_effects_1.PlayItemEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const pokemonCard = opponent.active.getPokemonCard();
            // Gothitelle is not Active Pokemon
            if (pokemonCard !== this) {
                return state;
            }
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
            throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_ABILITY);
        }
        return state;
    }
}
exports.Gothitelle = Gothitelle;
