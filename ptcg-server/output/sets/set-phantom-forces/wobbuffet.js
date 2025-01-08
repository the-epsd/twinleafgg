"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wobbuffet = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_card_list_1 = require("../../game/store/state/pokemon-card-list");
class Wobbuffet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Bide Barricade',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'As long as this Pokemon is your Active Pokemon, each Pokemon in ' +
                    'play, in each player\'s hand, and in each player\'s discard pile has ' +
                    'no Abilities (except for P Pokemon).'
            }];
        this.attacks = [{
                name: 'Psychic Assault',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'This attack does 10 more damage for each damage counter on ' +
                    'your opponent\'s Active Pokemon.'
            }];
        this.set = 'PHF';
        this.name = 'Wobbuffet';
        this.fullName = 'Wobbuffet PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.damage += effect.opponent.active.damage;
            return state;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === pokemon_types_1.PowerType.ABILITY && effect.power.name !== 'Mischievous Lock') {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Wobbuffet is not active Pokemon
            if (player.active.getPokemonCard() !== this
                && opponent.active.getPokemonCard() !== this) {
                return state;
            }
            let cardTypes = [effect.card.cardType];
            const cardList = state_utils_1.StateUtils.findCardList(state, effect.card);
            if (cardList instanceof pokemon_card_list_1.PokemonCardList) {
                const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(cardList);
                store.reduceEffect(state, checkPokemonType);
                cardTypes = checkPokemonType.cardTypes;
            }
            // We are not blocking the Abilities from Psychic Pokemon
            if (cardTypes.includes(card_types_1.CardType.PSYCHIC)) {
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
            if (!effect.power.exemptFromAbilityLock) {
                throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        return state;
    }
}
exports.Wobbuffet = Wobbuffet;
