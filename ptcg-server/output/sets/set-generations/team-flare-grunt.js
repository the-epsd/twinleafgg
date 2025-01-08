"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamFlareGrunt = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const activeHasEnergy = opponent.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY);
    if (!activeHasEnergy) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (player.supporterTurn >= 1) {
        throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    const target = opponent.active;
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, target, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected;
        next();
    });
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    target.moveCardsTo(cards, opponent.discard);
    return state;
}
class TeamFlareGrunt extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'GEN';
        this.name = 'Team Flare Grunt';
        this.fullName = 'Team Flare Grunt GEN';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '73';
        this.text = 'Discard an Energy attached to your opponent\'s Active Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.TeamFlareGrunt = TeamFlareGrunt;
