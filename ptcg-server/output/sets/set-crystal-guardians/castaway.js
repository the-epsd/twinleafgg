"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Castaway = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    if (player.deck.cards.length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const blocked = [];
    player.deck.cards.forEach((c, index) => {
        const isSupporter = c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.SUPPORTER;
        const isBasicEnergy = c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC;
        const isTool = c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.TOOL;
        if (!isSupporter && !isBasicEnergy && !isTool) {
            blocked.push(index);
        }
    });
    const maxSupporters = 1;
    const maxEnergies = 1;
    const maxTools = 1;
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 3, allowCancel: true, blocked, maxSupporters, maxEnergies, maxTools }), selected => {
        cards = selected || [];
        next();
    });
    player.hand.moveCardTo(self, player.supporter);
    player.deck.moveCardsTo(cards, player.hand);
    if (cards.length > 0) {
        yield store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Castaway extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '72';
        this.name = 'Castaway';
        this.fullName = 'Castaway CG';
        this.text = 'Search your deck for a Supporter card, a Pokémon Tool card, and a basic Energy card. Show them to your opponent, and put them into your hand. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Castaway = Castaway;
