"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrumsOfAwakening = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class DrumsOfAwakening extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.ACE_SPEC];
        this.regulationMark = 'H';
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '141';
        this.name = 'Awakening Drum';
        this.fullName = 'Awakening Drum TEF';
        this.text = 'Draw a card for each of your Ancient Pokémon in play.';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            let ancientPokemonCount = 0;
            if ((_b = (_a = player.active) === null || _a === void 0 ? void 0 : _a.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(card_types_1.CardTag.ANCIENT)) {
                ancientPokemonCount++;
            }
            player.bench.forEach(benchSpot => {
                var _a;
                if ((_a = benchSpot.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.ANCIENT)) {
                    ancientPokemonCount++;
                }
            });
            player.deck.moveTo(player.hand, ancientPokemonCount);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.DrumsOfAwakening = DrumsOfAwakening;
