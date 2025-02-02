"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Potion = void 0;
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
        if (cardList.damage === 0) {
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
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), results => {
        targets = results || [];
        next();
    });
    if (targets.length === 0) {
        return state;
    }
    targets.forEach(target => {
        // Heal Pokemon
        const healEffect = new game_effects_1.HealEffect(player, target, 30);
        store.reduceEffect(state, healEffect);
    });
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
}
class Potion extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'G';
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '188';
        this.name = 'Potion';
        this.fullName = 'Potion SVI';
        this.text = 'Heal 30 damage from 1 of your Pokemon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Potion = Potion;
