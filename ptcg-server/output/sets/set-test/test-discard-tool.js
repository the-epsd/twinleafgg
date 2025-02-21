"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscardTool = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    let hasPokemonWithTool = false;
    const blocked = [];
    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.cards.some(c => c.superType === card_types_1.SuperType.TRAINER)) {
            hasPokemonWithTool = true;
        }
        else {
            blocked.push(target);
        }
    });
    if (!hasPokemonWithTool) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    let targets = [];
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), results => {
        targets = results || [];
        next();
    });
    if (targets.length === 0) {
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
    }
    const target = targets[0];
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, target, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.TOOL }, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected;
        next();
    });
    target.moveCardsTo(cards, opponent.discard);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
}
class DiscardTool extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'TEST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.name = 'Discard Tool';
        this.fullName = 'Discard Tool TEST';
        this.text = 'Discard a Pokémon Tool attached to 1 of your Opponent\'s Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.DiscardTool = DiscardTool;
