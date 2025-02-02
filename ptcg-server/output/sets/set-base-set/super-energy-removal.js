"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperEnergyRemoval = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    let hasPokemonWithEnergy = false;
    const blocked = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.cards.some(c => c.superType === card_types_1.SuperType.ENERGY)) {
            hasPokemonWithEnergy = true;
        }
        else {
            blocked.push(target);
        }
    });
    if (!hasPokemonWithEnergy) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    let oppHasPokemonWithEnergy = false;
    const blocked2 = [];
    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.cards.some(c => c.superType === card_types_1.SuperType.ENERGY)) {
            oppHasPokemonWithEnergy = true;
        }
        else {
            blocked2.push(target);
        }
    });
    if (!oppHasPokemonWithEnergy) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    let targets = [];
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), results => {
        targets = results || [];
        next();
    });
    if (targets.length === 0) {
        return state;
    }
    const target = targets[0];
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, target, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected;
        next();
    });
    target.moveCardsTo(cards, player.discard);
    let targets2 = [];
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked: blocked2 }), results => {
        targets2 = results || [];
        next();
    });
    if (targets2.length === 0) {
        return state;
    }
    const target2 = targets2[0];
    let cards2 = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, target2, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 2, allowCancel: false }), selected => {
        cards2 = selected;
        next();
    });
    target2.moveCardsTo(cards2, opponent.discard);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
}
class SuperEnergyRemoval extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
        this.name = 'Super Energy Removal';
        this.fullName = 'Super Energy Removal BS';
        this.text = 'Discard 1 Energy card attached to 1 of your Pokémon in order to choose 1 of your opponent\'s Pokémon and up to 2 Energy cards attached to it. Discard those Energy cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.SuperEnergyRemoval = SuperEnergyRemoval;
