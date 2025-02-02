"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrambleSwitch = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const hasBench = player.bench.some(b => b.cards.length > 0);
    if (hasBench === false) {
        throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Do not discard the card yet
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    effect.preventDefault = true;
    let targets = [];
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: true }), results => {
        targets = results || [];
        next();
    });
    if (targets.length === 0) {
        return state;
    }
    const target = targets[0];
    const hasEnergies = player.active.cards.some(c => c instanceof game_1.EnergyCard);
    if (hasEnergies) {
        yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0 }), selected => {
            selected = selected || [];
            player.active.moveCardsTo(selected, target);
            next();
        });
    }
    // Discard trainer only when user selected a Pokemon
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    player.switchPokemon(targets[0]);
    return state;
}
class ScrambleSwitch extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.ACE_SPEC];
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'PLS';
        this.name = 'Scramble Switch';
        this.fullName = 'Scramble Switch PLS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '129';
        this.text = 'Switch your Active Pokemon with 1 of your Benched Pokemon. ' +
            'Then, you may move as many Energy attached to the old Active Pokemon ' +
            'to the new Active Pokemon as you like.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.ScrambleSwitch = ScrambleSwitch;
