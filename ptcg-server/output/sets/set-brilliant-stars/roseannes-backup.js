"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoseannesBackup = void 0;
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    let cards = [];
    const hasValidCard = player.discard.cards.some(c => c instanceof pokemon_card_1.PokemonCard ||
        (c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.TOOL) ||
        (c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.STADIUM) ||
        c instanceof game_1.EnergyCard);
    if (!hasValidCard) {
        throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    // Count tools and items separately
    let pokemon = 0;
    let tools = 0;
    let stadiums = 0;
    let basicEnergies = 0;
    let specialEnergies = 0;
    const blocked = [];
    player.discard.cards.forEach((c, index) => {
        if (c instanceof pokemon_card_1.PokemonCard) {
            pokemon += 1;
        }
        else if (c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.TOOL) {
            tools += 1;
        }
        else if (c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.STADIUM) {
            stadiums += 1;
        }
        else if (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC) {
            basicEnergies += 1;
        }
        else if (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.SPECIAL) {
            specialEnergies += 1;
        }
        else {
            blocked.push(index);
        }
    });
    // Limit max for each type to 1
    const maxPokemons = Math.min(pokemon, 1);
    const maxTools = Math.min(tools, 1);
    const maxStadiums = Math.min(stadiums, 1);
    const maxEnergies = Math.min(basicEnergies + specialEnergies, 1);
    const maxBasicEnergies = Math.min(basicEnergies, 1);
    const maxSpecialEnergies = Math.min(specialEnergies, 1);
    // Total max is sum of max for each 
    const count = maxPokemons + maxTools + maxStadiums + maxEnergies;
    // Pass max counts to prompt options
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_ONE_ITEM_AND_ONE_TOOL_TO_HAND, player.discard, {}, { min: 1, max: count, allowCancel: false, blocked, maxPokemons, maxTools, maxStadiums, maxEnergies, maxBasicEnergies, maxSpecialEnergies }), selected => {
        cards = selected || [];
        next();
    });
    player.discard.moveCardsTo(cards, player.deck);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    cards.forEach((card, index) => {
        store.log(state, game_message_1.GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
    });
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class RoseannesBackup extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'BRS';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '148';
        this.name = 'Roseanne\'s Backup';
        this.fullName = 'Roseanne\'s Backup BRS';
        this.text = `Choose 1 or more:

  • Shuffle a Pokémon from your discard pile into your deck.
  • Shuffle a Pokémon Tool card from your discard pile into your deck.
  • Shuffle a Stadium card from your discard pile into your deck.
  • Shuffle an Energy card from your discard pile into your deck.`;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.RoseannesBackup = RoseannesBackup;
