"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mankey = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Mankey extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 30;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.powers = [{
                name: 'Peek',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'Once during your turn (before your attack), you may look at one of the following: the top card of either player\'s deck, a random card from your opponent\'s hand, or one of either player\'s Prizes. This power can\'t be used if Mankey is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [{
                name: 'Scratch',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Mankey';
        this.fullName = 'Mankey JU';
        this.PEEK_MARKER = 'PEEK_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP) ||
                cardList.specialConditions.includes(card_types_1.SpecialCondition.CONFUSED) ||
                cardList.specialConditions.includes(card_types_1.SpecialCondition.PARALYZED)) {
                return state;
            }
            if (player.marker.hasMarker(this.PEEK_MARKER)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const options = [
                {
                    message: game_1.GameMessage.REVEAL_YOUR_TOP_DECK,
                    action: () => {
                        const deckTop = new game_1.CardList();
                        player.deck.moveTo(deckTop, 1);
                        state = store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.REVEAL_YOUR_TOP_DECK, deckTop.cards), () => state);
                        deckTop.moveToTopOfDestination(player.deck);
                        player.marker.addMarker(this.PEEK_MARKER, this);
                        return state;
                    }
                },
                {
                    message: game_1.GameMessage.REVEAL_OPPONENT_TOP_DECK,
                    action: () => {
                        const deckTop = new game_1.CardList();
                        opponent.deck.moveTo(deckTop, 1);
                        state = store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.REVEAL_OPPONENT_TOP_DECK, deckTop.cards), () => state);
                        deckTop.moveToTopOfDestination(opponent.deck);
                        player.marker.addMarker(this.PEEK_MARKER, this);
                        return state;
                    }
                },
                {
                    message: game_1.GameMessage.REVEAL_RANDOM_CARD_IN_OPPONENT_HAND,
                    action: () => {
                        if (opponent.hand.cards.length === 0) {
                            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                        }
                        let cards = [];
                        state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.REVEAL_RANDOM_CARD_IN_OPPONENT_HAND, opponent.hand, {}, { min: 1, max: 1, allowCancel: false, isSecret: true }), selected => {
                            cards = selected || [];
                            if (cards.length > 0) {
                                state = store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
                            }
                        });
                        player.marker.addMarker(this.PEEK_MARKER, this);
                        return state;
                    }
                },
                {
                    message: game_1.GameMessage.REVEAL_AN_OPPONENT_PRIZES,
                    action: () => {
                        const prizes = opponent.prizes.filter(p => p.isSecret);
                        if (prizes.length === 0) {
                            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                        }
                        let list = [];
                        const cards = [];
                        prizes.forEach(p => { p.cards.forEach(c => cards.push(c)); });
                        const allPrizeCards = new game_1.CardList();
                        opponent.prizes.forEach(prizeList => {
                            allPrizeCards.cards.push(...prizeList.cards);
                        });
                        state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.REVEAL_ONE_OF_YOUR_PRIZES, allPrizeCards, {}, { min: 1, max: 1, allowCancel: false, isSecret: true }), chosenPrize => {
                            list = chosenPrize || [];
                            if (list.length > 0) {
                                state = store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, list), () => state);
                            }
                        });
                        player.marker.addMarker(this.PEEK_MARKER, this);
                        return state;
                    }
                },
                {
                    message: game_1.GameMessage.REVEAL_ONE_OF_YOUR_PRIZES,
                    action: () => {
                        const prizes = player.prizes.filter(p => p.isSecret);
                        if (prizes.length === 0) {
                            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                        }
                        let list = [];
                        const cards = [];
                        prizes.forEach(p => { p.cards.forEach(c => cards.push(c)); });
                        const allPrizeCards = new game_1.CardList();
                        player.prizes.forEach(prizeList => {
                            allPrizeCards.cards.push(...prizeList.cards);
                        });
                        state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.REVEAL_ONE_OF_YOUR_PRIZES, allPrizeCards, {}, { min: 1, max: 1, allowCancel: false, isSecret: true }), chosenPrize => {
                            list = chosenPrize || [];
                            if (list.length > 0) {
                                state = store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, list), () => state);
                            }
                        });
                        player.marker.addMarker(this.PEEK_MARKER, this);
                        return state;
                    }
                }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.PEEK_MARKER, this)) {
            effect.player.marker.removeMarker(this.PEEK_MARKER, this);
        }
        return state;
    }
}
exports.Mankey = Mankey;
