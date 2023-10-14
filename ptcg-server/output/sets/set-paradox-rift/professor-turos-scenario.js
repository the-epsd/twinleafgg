"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessorTurosScenario = void 0;
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], { allowCancel: true }), targets => {
        if (targets && targets.length > 0) {
            // Discard trainer only when user selected a Pokemon
            player.hand.moveCardTo(effect.trainerCard, player.discard);
            targets[0].moveTo(player.hand);
            targets[0].damage = 0;
            targets[0].clearEffects();
        }
    });
}
class ProfessorTurosScenario extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'G';
        this.set = 'PAR';
        this.set2 = 'futureflash';
        this.setNumber = '65';
        this.name = 'Professor Turo\'s Scenario';
        this.fullName = 'Professor Turo\'s Scenario PAR';
        this.text = 'Put 1 of your Pokémon into your hand. (Discard all attached cards.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.ProfessorTurosScenario = ProfessorTurosScenario;
