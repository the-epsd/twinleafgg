"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spiritomb = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
class Spiritomb extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Fettered in Misfortune',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Basic Pokémon V in play (both yours and your opponent\'s) have ' +
                    'no Abilities. '
            }];
        this.attacks = [{
                name: 'Fade Out',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'Put this Pokémon and all attached cards into your hand. '
            }];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '89';
        this.name = 'Spiritomb';
        this.fullName = 'Spiritomb PAL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect
            && effect.power.powerType === pokemon_types_1.PowerType.ABILITY
            && effect.power.name !== 'Fettered in Misfortune') {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isSpiritombInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isSpiritombInPlay = true;
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    isSpiritombInPlay = true;
                }
            });
            if (!isSpiritombInPlay) {
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
            const pokemonCard = effect.card;
            if (pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_V) ||
                pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_VMAX) ||
                pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) ||
                pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_ABILITY);
            }
            return state;
        }
        return state;
    }
}
exports.Spiritomb = Spiritomb;
