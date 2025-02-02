"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RareCandy = void 0;
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_manager_1 = require("../../game/cards/card-manager");
const check_effects_1 = require("../../game/store/effects/check-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_effects_1 = require("../../game/store/effects/game-effects");
function isMatchingStage2(stage1, basic, stage2) {
    for (const card of stage1) {
        if (card.name === stage2.evolvesFrom && basic.name === card.evolvesFrom) {
            return true;
        }
    }
    return false;
}
function* playCard(next, store, state, effect) {
    const player = effect.player;
    // Create list of non - Pokemon SP slots
    const blocked = [];
    let hasBasicPokemon = false;
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    const stage2 = player.hand.cards.filter(c => {
        return c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.STAGE_2;
    });
    if (stage2.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Look through all known cards to find out if it's a valid Stage 2
    const cm = card_manager_1.CardManager.getInstance();
    const stage1 = cm.getAllCards().filter(c => {
        return c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.STAGE_1;
    });
    player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (card.stage === card_types_1.Stage.BASIC && stage2.some(s => isMatchingStage2(stage1, card, s))) {
            const playedTurnEffect = new check_effects_1.CheckPokemonPlayedTurnEffect(player, list);
            store.reduceEffect(state, playedTurnEffect);
            if (playedTurnEffect.pokemonPlayedTurn < state.turn) {
                hasBasicPokemon = true;
                return;
            }
        }
        blocked.push(target);
    });
    if (!hasBasicPokemon) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    let targets = [];
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_EVOLVE, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], { allowCancel: false, blocked }), selection => {
        targets = selection || [];
        next();
    });
    if (targets.length === 0) {
        return state; // canceled by user
    }
    const pokemonCard = targets[0].getPokemonCard();
    if (pokemonCard === undefined) {
        return state; // invalid target?
    }
    const blocked2 = [];
    player.hand.cards.forEach((c, index) => {
        if (c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.STAGE_2) {
            if (!isMatchingStage2(stage1, pokemonCard, c)) {
                blocked2.push(index);
            }
        }
    });
    let cards = [];
    return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.hand, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.STAGE_2 }, { min: 1, max: 1, allowCancel: false, blocked: blocked2 }), selected => {
        cards = selected || [];
        if (cards.length > 0) {
            const pokemonCard = cards[0];
            const evolveEffect = new game_effects_1.EvolveEffect(player, targets[0], pokemonCard);
            store.reduceEffect(state, evolveEffect);
            // Discard trainer only when user selected a Pokemon
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
    });
}
class RareCandy extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '191';
        this.name = 'Rare Candy';
        this.fullName = 'Rare Candy SVI';
        this.text = 'Choose 1 of your Basic Pokemon in play. If you have a Stage 2 card in ' +
            'your hand that evolves from that Pokemon, put that card onto the Basic ' +
            'Pokemon to evolve it. You can\'t use this card during your first turn ' +
            'or on a Basic Pokemon that was put into play this turn.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.RareCandy = RareCandy;
