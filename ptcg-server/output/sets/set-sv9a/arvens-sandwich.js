"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArvensSandwich = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class ArvensSandwich extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.ARVENS];
        this.regulationMark = 'I';
        this.set = 'SV9a';
        this.setNumber = '57';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Arven\'s Sandwich';
        this.fullName = 'Arven\'s Sandwich SV9a';
        this.text = 'Heal 30 damage from your Active Pokémon. If that Pokémon is an Arven\'s Pokémon, heal 100 damage instead.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (trainer_prefabs_1.WAS_TRAINER_USED(effect, this)) {
            const player = effect.player;
            if (player.active.damage === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if ((_a = player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.ARVENS)) {
                const healing = new game_effects_1.HealEffect(player, player.active, 100);
                store.reduceEffect(state, healing);
            }
            else {
                const healing = new game_effects_1.HealEffect(player, player.active, 30);
                store.reduceEffect(state, healing);
            }
        }
        return state;
    }
}
exports.ArvensSandwich = ArvensSandwich;
