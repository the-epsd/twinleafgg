"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BirdKeeper = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const hasBench = player.bench.some(b => b.cards.length > 0);
    if (hasBench === false) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // Do not discard the card yet
    effect.preventDefault = true;
    let targets = [];
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), results => {
        targets = results || [];
        next();
    });
    if (targets.length === 0) {
        return state;
    }
    player.switchPokemon(targets[0]);
    player.deck.moveTo(player.hand, 3);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
}
class BirdKeeper extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'D';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'DAA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '159';
        this.name = 'Bird Keeper';
        this.fullName = 'Bird Keeper DAA';
        this.text = 'Switch your Active Pokemon with 1 of your Benched Pokemon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.BirdKeeper = BirdKeeper;
