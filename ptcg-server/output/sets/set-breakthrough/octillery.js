"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Octillery = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Octillery extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Remoraid';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Abyssal Hand',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may draw cards until you have 5 cards in your hand.'
            }];
        this.attacks = [{
                name: 'Hug',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            }];
        this.set = 'BKT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Octillery';
        this.fullName = 'Octillery BKT';
        this.ABYSSAL_HAND_MARKER = 'ABYSSAL_HAND_MARKER';
        this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.ABYSSAL_HAND_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ABYSSAL_HAND_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.ABYSSAL_HAND_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.ABYSSAL_HAND_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.hand.cards.length >= 5) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            while (player.hand.cards.length < 5) {
                if (player.deck.cards.length === 0) {
                    break;
                }
                player.deck.moveTo(player.hand, 1);
            }
            player.marker.addMarker(this.ABYSSAL_HAND_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        return state;
    }
}
exports.Octillery = Octillery;
