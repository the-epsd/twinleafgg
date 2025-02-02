"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kingdra = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Kingdra extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Seadra';
        this.powers = [{
                name: 'Seething Currents',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, you may have either player shuffle their hand and put it on the bottom of their deck. If that player put any cards on the bottom of their deck in this way, they draw 4 cards.'
            }];
        this.attacks = [{
                name: 'Hydro Splash',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 130,
                text: ''
            }];
        this.set = 'LOR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.name = 'Kingdra';
        this.fullName = 'Kingdra LOR';
        this.SEETHING_CURRENTS_MARKER = 'SEETHING_CURRENTS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check to see if anything is blocking our Ability
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
            // Can't use ability if already used
            if (player.marker.hasMarker(this.SEETHING_CURRENTS_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const deckBottom = new game_1.CardList();
            const opponentDeckBottom = new game_1.CardList();
            if (player.hand.cards.length === 0 && opponent.hand.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const options = [
                {
                    message: game_1.GameMessage.SHUFFLE_OPPONENT_HAND,
                    action: () => {
                        // Shuffle the opponent's hand
                        this.shufflePlayerHand(opponent);
                        opponent.hand.moveTo(opponentDeckBottom);
                        opponentDeckBottom.moveTo(opponent.deck);
                        opponent.deck.moveTo(opponent.hand, 4);
                    }
                },
                {
                    message: game_1.GameMessage.SHUFFLE_YOUR_HAND,
                    action: () => {
                        // Shuffle the player's hand
                        this.shufflePlayerHand(player);
                        player.hand.moveTo(deckBottom);
                        deckBottom.moveTo(player.deck);
                        player.deck.moveTo(player.hand, 4);
                    }
                }
            ];
            player.marker.addMarker(this.SEETHING_CURRENTS_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.SEETHING_CURRENTS_MARKER, this);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.SEETHING_CURRENTS_MARKER, this);
            return state;
        }
        return state;
    }
    shufflePlayerHand(player) {
        const hand = player.hand.cards;
        // Shuffle the hand using the Fisher-Yates shuffle algorithm
        for (let i = hand.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [hand[i], hand[j]] = [hand[j], hand[i]];
        }
    }
}
exports.Kingdra = Kingdra;
