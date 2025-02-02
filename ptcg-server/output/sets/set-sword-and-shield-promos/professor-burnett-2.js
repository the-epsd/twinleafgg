"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessorBurnet2 = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const charmander_1 = require("../set-hidden-fates/charmander");
class ProfessorBurnet2 extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SWSH';
        this.set2 = 'swshpromos';
        this.setNumber = '167';
        this.name = 'Professor Burnet2';
        this.fullName = 'Professor Burnet2 SWSH';
        this.text = 'Summon Charizard';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const slots = player.bench.filter(b => b.cards.length === 0);
            const charmander = new charmander_1.Charmander();
            if (slots.length > 0) {
                new play_card_effects_1.PlayPokemonEffect(player, charmander, slots[0]);
                player.bench.push(slots[0]);
                slots[0].pokemonPlayedTurn = state.turn;
            }
            return state;
        }
        return state;
    }
}
exports.ProfessorBurnet2 = ProfessorBurnet2;
