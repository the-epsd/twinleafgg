"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragonsElixir = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const activePokemon = player.active.getPokemonCard();
    if (activePokemon && activePokemon.cardType !== card_types_1.CardType.DRAGON) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (player.active.damage === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Do not discard the card yet
    effect.preventDefault = true;
    const healEffect = new game_effects_1.HealEffect(player, player.active, 60);
    store.reduceEffect(state, healEffect);
    player.hand.moveCardTo(effect.trainerCard, player.discard);
    return state;
}
class DragonsElixir extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '172';
        this.name = 'Dragon Elixir';
        this.fullName = 'Dragon\'s Elixir SV7a';
        this.text = 'Heal 60 damage from your Active Dragon Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.DragonsElixir = DragonsElixir;
