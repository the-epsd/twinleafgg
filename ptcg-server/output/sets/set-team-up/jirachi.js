"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jirachi = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Jirachi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Stellar Wish',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokemon is your Active Pokemon, you may look at the top 5 cards of your deck, reveal a Trainer card you find there, and put it into your hand. Then, shuffle the other cards back into your deck, and this Pokemon is now Asleep.'
            }];
        this.attacks = [{
                name: 'Slap',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }];
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '99';
        this.name = 'Jirachi';
        this.fullName = 'Jirachi TEU';
        this.STELLAR_WISH_MARKER = 'STELLAR_WISH_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.STELLAR_WISH_MARKER, this);
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.STELLAR_WISH_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.STELLAR_WISH_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.cards[0] !== this) {
                return state; // Not active
            }
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 5);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false }), selected => {
                player.marker.addMarker(this.STELLAR_WISH_MARKER, this);
                deckTop.moveCardsTo(selected, player.hand);
                deckTop.moveTo(player.deck);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                        cardList.addSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
                    }
                });
                if (selected.length > 0) {
                    return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected), () => {
                    });
                }
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Jirachi = Jirachi;
