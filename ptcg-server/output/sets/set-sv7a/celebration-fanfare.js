"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CelebrationFanfare = void 0;
const game_effects_1 = require("../../game/store/effects/game-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class CelebrationFanfare extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'SVP';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '174';
        this.name = 'Celebration Fanfare';
        this.fullName = 'Celebration Fanfare SVP';
        this.text = 'Once during each player\'s turn, that player may heal 10 damage from each of their Pokémon.If they do, that player\'s turn ends.';
    }
    useStadium(store, state, effect) {
        const player = effect.player;
        player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
            const healEffect = new game_effects_1.HealEffect(player, cardList, 10);
            state = store.reduceEffect(state, healEffect);
            const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
            store.reduceEffect(state, endTurnEffect);
            return state;
        });
        return state;
    }
}
exports.CelebrationFanfare = CelebrationFanfare;
