"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperPotion = void 0;
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
        if (cardList.damage === 0 || !cardList.cards.some(c => c instanceof game_1.EnergyCard)) {
            blocked.push(target);
        }
        else {
            hasPokemonWithDamage = true;
        }
    });
    if (hasPokemonWithDamage === false) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Do not discard the card yet
    effect.preventDefault = true;
    let targets = [];
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: true, blocked }), results => {
        targets = results || [];
        next();
    });
    if (targets.length === 0) {
        return state;
    }
    const target = targets[0];
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, target, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length === 0) {
        return state;
    }
    // Discard trainer only when user selected a Pokemon
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    target.moveCardsTo(cards, player.discard);
    // Heal Pokemon
    const healEffect = new game_effects_1.HealEffect(player, target, 40);
    store.reduceEffect(state, healEffect);
    return state;
}
class SuperPotion extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
        this.name = 'Super Potion';
        this.fullName = 'Super Potion BS';
        this.text = 'Discard 1 Energy card attached to 1 of your own Pokémon in order to remove up to 4 damage counters from that Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.SuperPotion = SuperPotion;
