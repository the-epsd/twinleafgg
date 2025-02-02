"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Candice = void 0;
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    let cards = [];
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    const deckTop = new game_1.CardList();
    player.deck.moveTo(deckTop, 7);
    let pokemons = 0;
    let energies = 0;
    const blocked = [];
    deckTop.cards.forEach((c, index) => {
        if (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Water Energy') {
            energies += 1;
        }
        else if (c instanceof game_1.PokemonCard && c.cardType === card_types_1.CardType.WATER) {
            pokemons += 1;
        }
        else {
            blocked.push(index);
        }
    });
    const maxPokemons = Math.min(pokemons, 7);
    const maxEnergies = Math.min(energies, 7);
    const count = 7;
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxEnergies }), selected => {
        cards = selected || [];
        next();
    });
    deckTop.moveCardsTo(cards, player.hand);
    deckTop.moveTo(player.deck);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    if (cards.length > 0) {
        yield store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Candice extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '152';
        this.regulationMark = 'F';
        this.name = 'Candice';
        this.fullName = 'Candice SIT';
        this.text = 'Look at the top 7 cards of your deck. You may reveal any number of [W] Pokémon and [W] Energy cards you find there and put them into your hand. Shuffle the other cards back into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Candice = Candice;
