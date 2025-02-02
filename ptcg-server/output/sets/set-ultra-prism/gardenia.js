"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gardenia = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const blocked = [];
    let hasPokemonWithDamage = false;
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.damage === 0 || !cardList.cards.some(c => c instanceof game_1.EnergyCard && c.name === 'Grass Energy')) {
            blocked.push(target);
        }
        else {
            hasPokemonWithDamage = true;
        }
    });
    if (hasPokemonWithDamage === false) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    if (player.hand.cards.length < 4) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (player.deck.cards.length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    let targets = [];
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), results => {
        targets = results || [];
        next();
    });
    if (targets.length === 0) {
        return state;
    }
    const target = targets[0];
    // Discard trainer only when user selected a Pokemon
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    // Heal Pokemon
    const healEffect = new game_effects_1.HealEffect(player, target, 80);
    store.reduceEffect(state, healEffect);
    return state;
}
class Gardenia extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'UPR';
        this.name = 'Gardenia';
        this.fullName = 'Gardenia UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '124';
        this.text = 'Heal 80 damage from 1 of your Pokémon that has any [G] Energy attached to it.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Gardenia = Gardenia;
