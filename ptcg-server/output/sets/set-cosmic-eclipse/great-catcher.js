"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreatCatcher = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    // If opponent doesn't have any valid cards on their bench, 
    // or if we don't have at least two cards in hand, we can't play this card.
    const hasBench = opponent.bench.some(b => {
        var _a, _b;
        return ((_a = b.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_GX)) ||
            ((_b = b.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(card_types_1.CardTag.POKEMON_EX));
    });
    const cards = player.hand.cards.filter(c => c !== self);
    if (!hasBench || cards.length < 2) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    // Discard cards (excluding this card from the prompt)
    const handTemp = new game_1.CardList();
    handTemp.cards = cards;
    let discardCards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, handTemp, {}, { min: 2, max: 2, allowCancel: true }), selected => {
        discardCards = selected || [];
        next();
    });
    if (discardCards.length == 0) {
        return state;
    } // Operation canceled by the user
    // Can't cancel next prompt, so now discard things
    player.hand.moveCardTo(self, player.discard);
    player.hand.moveCardsTo(discardCards, player.discard);
    // Can only gust EX or GX
    const gustBlocked = [];
    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cards, card, target) => {
        if (!(card.tags.includes(card_types_1.CardTag.POKEMON_GX)) && !(card.tags.includes(card_types_1.CardTag.POKEMON_EX))) {
            gustBlocked.push(target);
        }
    });
    // Gust effect
    return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, blocked: gustBlocked }), result => {
        const cardList = result[0];
        opponent.switchPokemon(cardList);
    });
}
class GreatCatcher extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'CEC';
        this.setNumber = '192';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Great Catcher';
        this.fullName = 'Great Catcher CEC';
        this.text = 'You can play this card only if you discard two other cards. Switch 1 of your opponent\'s Benched Pokemon-GX or Pokemon-EX ' +
            'with their Active Pokemon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.GreatCatcher = GreatCatcher;
