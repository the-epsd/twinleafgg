"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Potion = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
function* usePotion(next, store, state, effect) {
    const player = effect.player;
    const maxAllowedHealing = [];
    const healingLeft = 0;
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        maxAllowedHealing.push({ target, damage: cardList.damage });
    });
    const healing = Math.min(20, healingLeft);
    if (maxAllowedHealing.filter(m => m.damage > 0).length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    return store.prompt(state, new game_1.PutDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], healing, maxAllowedHealing, { allowCancel: false }), targets => {
        const results = targets || [];
        for (const result of results) {
            const target = game_1.StateUtils.getTarget(state, player, result.target);
            const healEffect = new game_effects_1.HealEffect(effect.player, target, result.damage);
            healEffect.target = target;
            store.reduceEffect(state, healEffect);
        }
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
    });
}
class Potion extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BS'; // Replace with the appropriate set abbreviation
        this.name = 'Potion';
        this.fullName = 'Potion BS'; // Replace with the appropriate set abbreviation
        this.cardImage = 'assets/cardback.png'; // Replace with the appropriate card image path
        this.setNumber = '94'; // Replace with the appropriate set number
        this.text = 'Remove up to 2 damage counters from 1 of your Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = usePotion(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Potion = Potion;
