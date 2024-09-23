"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LastChancePotion = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const blocked = [];
    let hasPokemonWithDamage = false;
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new check_effects_1.CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHpEffect);
        if (checkHpEffect.hp - cardList.damage > 30) {
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
    // Do not discard the card yet
    effect.preventDefault = true;
    let targets = [];
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), results => {
        targets = results || [];
        next();
    });
    if (targets.length === 0) {
        return state;
    }
    // Discard trainer only when user selected a Pokemon
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    targets.forEach(target => {
        // Heal Pokemon
        const healEffect = new game_effects_1.HealEffect(player, target, 120);
        store.reduceEffect(state, healEffect);
    });
    return state;
}
class LastChancePotion extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'CES';
        this.name = 'Last Chance Potion';
        this.fullName = 'Last Chance Potion CES';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '135';
        this.text = 'Heal 120 damage from 1 of your Pokémon that has 30 HP or less remaining.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.LastChancePotion = LastChancePotion;
