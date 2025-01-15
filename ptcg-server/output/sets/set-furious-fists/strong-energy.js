"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrongEnergy = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const state_utils_1 = require("../../game/store/state-utils");
class StrongEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'FFI';
        this.name = 'Strong Energy';
        this.fullName = 'Strong Energy FFI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '104';
        this.STRONG_ENERGY_MAREKER = 'STRONG_ENERGY_MAREKER';
        this.text = 'This card can only be attached to F Pokemon. This card provides F ' +
            'Energy only while this card is attached to a F Pokemon. The attacks of ' +
            'the F Pokemon this card is attached to do 20 more damage to your ' +
            'opponent\'s Active Pokemon (before applying Weakness and Resistance). ' +
            '(If this card is attached to anything other than a F Pokemon, discard ' +
            'this card.)';
    }
    reduceEffect(store, state, effect) {
        // Cannot attach to other than Fighting Pokemon
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonType);
            if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.FIGHTING)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            return state;
        }
        // Provide energy when attached to Fighting Pokemon
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.source);
            store.reduceEffect(state, checkPokemonType);
            if (checkPokemonType.cardTypes.includes(card_types_1.CardType.FIGHTING)) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.FIGHTING] });
            }
            return state;
        }
        // Discard card when not attached to Fighting Pokemon
        if (effect instanceof play_card_effects_1.AttachEnergyEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (!cardList.cards.includes(this)) {
                        return;
                    }
                    const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(cardList);
                    store.reduceEffect(state, checkPokemonType);
                    if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.FIGHTING)) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
            return state;
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (effect.target !== opponent.active) {
                return state;
            }
            effect.damage += 20;
        }
        return state;
    }
}
exports.StrongEnergy = StrongEnergy;
