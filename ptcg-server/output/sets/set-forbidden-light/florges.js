"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Florges = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Florges extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = Y;
        this.hp = 120;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C, C];
        this.evolvesFrom = 'Floette';
        this.powers = [{
                name: 'Wondrous Gift',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may flip a coin. If heads, put an Item card from your discard pile on top of your deck.'
            }];
        this.attacks = [{
                name: 'Mist Guard',
                cost: [Y, Y, C],
                damage: 70,
                text: 'Prevent all damage done to this Pokémon by attacks from [N] Pokémon during your opponent\'s next turn.'
            }];
        this.set = 'FLI';
        this.name = 'Florges';
        this.fullName = 'Florges FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.MIST_GUARD_MARKER = 'MIST_GUARD_MARKER';
        this.CLEAR_MIST_GUARD_MARKER = 'CLEAR_MIST_GUARD_MARKER';
        this.WONDROUS_GIFT_MARKER = 'WONDROUS_GIFT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let cards = [];
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (player.marker.hasMarker(this.WONDROUS_GIFT_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                player.marker.addMarker(this.WONDROUS_GIFT_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                if (results === false) {
                    return state;
                }
                const deckTop = new game_1.CardList();
                store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { min: 1, max: 1, allowCancel: false }), selected => {
                    cards = selected || [];
                    const itemCards = cards.filter(card => card instanceof game_1.TrainerCard && card.trainerType === card_types_1.TrainerType.ITEM);
                    const nonTrainerCards = cards.filter(card => !(card instanceof game_1.TrainerCard));
                    let canMoveTrainerCards = true;
                    if (itemCards.length > 0) {
                        const discardEffect = new play_card_effects_1.TrainerToDeckEffect(player, itemCards[0]);
                        store.reduceEffect(state, discardEffect);
                        canMoveTrainerCards = !discardEffect.preventDefault;
                    }
                    const cardsToMove = canMoveTrainerCards ? cards : nonTrainerCards;
                    if (cardsToMove.length > 0) {
                        cardsToMove.forEach(card => {
                            player.discard.moveCardTo(card, deckTop);
                        });
                        deckTop.moveToTopOfDestination(player.deck);
                        if (cardsToMove.length > 0) {
                            return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cardsToMove), () => state);
                        }
                    }
                    return state;
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.MIST_GUARD_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_MIST_GUARD_MARKER, this);
            return state;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.target.marker.hasMarker(this.MIST_GUARD_MARKER)) {
            const card = effect.source.getPokemonCard();
            const dragonPokemon = card && card.cardType == N;
            if (dragonPokemon) {
                effect.preventDefault = true;
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if (effect.player.marker.hasMarker(this.CLEAR_MIST_GUARD_MARKER, this)) {
                effect.player.marker.removeMarker(this.CLEAR_MIST_GUARD_MARKER, this);
                const opponent = game_1.StateUtils.getOpponent(state, effect.player);
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                    cardList.marker.removeMarker(this.MIST_GUARD_MARKER, this);
                });
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.WONDROUS_GIFT_MARKER, this)) {
            effect.player.marker.removeMarker(this.WONDROUS_GIFT_MARKER, this);
        }
        return state;
    }
}
exports.Florges = Florges;
