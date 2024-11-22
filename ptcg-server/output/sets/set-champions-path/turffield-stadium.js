"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurffieldStadium = void 0;
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
function* useStadium(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const blocked = [];
    player.deck.cards.forEach((card, index) => {
        // eslint-disable-next-line no-empty
        if (card instanceof game_1.PokemonCard && card.stage !== card_types_1.Stage.BASIC && card.stage !== card_types_1.Stage.RESTORED && card.cardType === card_types_1.CardType.GRASS) {
        }
        else {
            blocked.push(index);
        }
    });
    let cards = [];
    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false, blocked }), selectedCards => {
        cards = selectedCards || [];
        // Operation canceled by the user
        if (cards.length === 0) {
            return state;
        }
        if (cards.length > 0) {
            store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
        }
        cards.forEach((card, index) => {
            player.deck.moveCardTo(card, player.hand);
        });
        return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
            return state;
        });
    });
}
class TurffieldStadium extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '68';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'CPA';
        this.name = 'Turffield Stadium';
        this.fullName = 'Turffield Stadium CPA';
        this.text = 'Once during each player\'s turn, that player may search their deck for an Evolution [G] Pokémon, reveal it, and put it into their hand. Then, that player shuffles their deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const generator = useStadium(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.TurffieldStadium = TurffieldStadium;
