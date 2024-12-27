"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanasFishingRod = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    let cards = [];
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    effect.preventDefault = true;
    let tools = 0;
    let pokemons = 0;
    const blocked = [];
    player.discard.cards.forEach((c, index) => {
        if (c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.TOOL) {
            tools += 1;
        }
        else if (c instanceof game_1.PokemonCard) {
            pokemons += 1;
        }
        else {
            blocked.push(index);
        }
    });
    const hasBoth = tools > 0 && pokemons > 0;
    const minCount = hasBoth ? 2 : (tools > 0 || pokemons > 0 ? 1 : 0);
    const maxCount = hasBoth ? 2 : 1;
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, hasBoth ? game_message_1.GameMessage.CHOOSE_CARD_TO_DECK : game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, {}, { min: minCount, max: maxCount, allowCancel: false, blocked, maxTools: 1, maxPokemons: 1 }), selected => {
        cards = selected || [];
        next();
    });
    player.discard.moveCardsTo(cards, player.deck);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    cards.forEach((card, index) => {
        store.log(state, game_message_1.GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
    });
    if (cards.length > 0) {
        yield store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class LanasFishingRod extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '195';
        this.name = 'Lana\'s Fishing Rod';
        this.fullName = 'Lana\'s Fishing Rod CEC';
        this.text = 'Shuffle a Pokémon and a Pokémon Tool card from your discard pile into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.LanasFishingRod = LanasFishingRod;
