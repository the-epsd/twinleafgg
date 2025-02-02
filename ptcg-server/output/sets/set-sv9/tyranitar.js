"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tyranitar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class Tyranitar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesFrom = 'Pupitar';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Daunting Gaze',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'While this Pokémon is in the Active Spot, your opponent can’t play any Item cards from their hand.'
            }];
        this.attacks = [{
                name: 'Crackling Stomp',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 150,
                text: 'Discard the top 2 cards of your opponent’s deck.'
            }];
        this.set = 'SV9';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
        this.name = 'Tyranitar';
        this.fullName = 'Tyranitar SV9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            opponent.deck.moveTo(opponent.discard, 2);
        }
        // beta vileplume gaming
        if (effect instanceof play_card_effects_1.PlayItemEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            let isTyranitarInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isTyranitarInPlay = true;
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    isTyranitarInPlay = true;
                }
            });
            if (!isTyranitarInPlay) {
                return state;
            }
            if (player.active.getPokemonCard() === this && opponent.active.getPokemonCard() !== this) {
                return state;
            }
            if (opponent.active.getPokemonCard() === this) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                    store.reduceEffect(state, powerEffect);
                }
                catch (_a) {
                    return state;
                }
                throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        return state;
    }
}
exports.Tyranitar = Tyranitar;
