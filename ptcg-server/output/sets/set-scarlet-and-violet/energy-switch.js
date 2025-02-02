"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergySwitch = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const energy_card_1 = require("../../game/store/card/energy-card");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const move_energy_prompt_1 = require("../../game/store/prompts/move-energy-prompt");
const state_utils_1 = require("../../game/store/state-utils");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    // Player has no Basic Energy in the discard pile
    let hasBasicEnergy = false;
    let pokemonCount = 0;
    player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        pokemonCount += 1;
        const basicEnergyAttached = cardList.cards.some(c => {
            return c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC;
        });
        hasBasicEnergy = hasBasicEnergy || basicEnergyAttached;
    });
    if (!hasBasicEnergy || pokemonCount <= 1) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    let transfers = [];
    yield store.prompt(state, new move_energy_prompt_1.MoveEnergyPrompt(player.id, game_message_1.GameMessage.MOVE_ENERGY_CARDS, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 1, max: 1, allowCancel: false }), result => {
        transfers = result || [];
        next();
    });
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    transfers.forEach(transfer => {
        const source = state_utils_1.StateUtils.getTarget(state, player, transfer.from);
        const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
        source.moveCardTo(transfer.card, target);
    });
    return state;
}
class EnergySwitch extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SVI';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '173';
        this.name = 'Energy Switch';
        this.fullName = 'Energy Switch SVI';
        this.text = 'Move a basic Energy from 1 of your Pokemon to another of your Pokemon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.EnergySwitch = EnergySwitch;
