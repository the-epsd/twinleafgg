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
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
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
            //If deck size is greater than 5, draw till hand has 5 cards via while loop
            if (player.deck.cards.length > 5) {
                while (player.hand.cards.length < 5) {
                    player.deck.moveTo(player.hand, 1);
                }
            }
            else {
                //Deck size is less than 5 so we have to check the hand size and draw as many as we can allow
                //If hand size is less than 5, find how many cards until we have 5 in our hand
                let handToFive = 5 - player.hand.cards.length;
                //If the amount of cards until 5 in hand is greater than the deck size, draw the rest of the deck
                if (handToFive > player.deck.cards.length) {
                    player.deck.moveTo(player.hand, player.deck.cards.length);
                }
                else {
                    // Distance to 5 cards in hand is less than cards left in deck so draw that amount.
                    player.deck.moveTo(player.hand, handToFive);
                }
            }
            player.marker.addMarker(this.ABYSSAL_HAND_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addSpecialCondition(card_types_1.SpecialCondition.ABILITY_USED);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, player => {
                if (player instanceof Octillery) {
                    player.marker.removeMarker(this.ABYSSAL_HAND_MARKER);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.attackMarker.addMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.attackMarker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.attackMarker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        return state;
    }
}
exports.Octillery = Octillery;
