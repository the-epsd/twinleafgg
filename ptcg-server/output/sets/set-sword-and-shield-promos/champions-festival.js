"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChampionsFestival = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_2 = require("../../game/store/effects/game-effects");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
class ChampionsFestival extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'SSH';
        this.name = 'Champion\'s Festival';
        this.fullName = 'Champion\'s Festival SWSH296';
        this.text = 'Once during each player\'s turn, if that player has .' +
            '6 Pokémon in play, they may heal 10 damage from ' +
            'each of their Pokémon. ';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_2.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            return this.useStadium(store, state, effect);
        }
        return state;
    }
    useStadium(store, state, effect) {
        const player = effect.player;
        if (player.active.cards.length + player.bench.length < 5) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
            const healEffect = new game_effects_1.HealEffect(player, cardList, 10);
            state = store.reduceEffect(state, healEffect);
        });
        return state;
    }
}
exports.ChampionsFestival = ChampionsFestival;
