"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpikemuthGym = void 0;
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
        if (card instanceof game_1.PokemonCard && (!card.cardTag.includes(card_types_1.CardTag.MARNIES)))
            blocked.push(index);
    });
    let cards = [];
    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false, blocked }), selectedCards => {
        cards = selectedCards || [];
        if (cards.length === 0)
            return state;
        if (cards.length > 0) {
            store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
        }
        cards.forEach((card, index) => { player.deck.moveCardTo(card, player.hand); });
        return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
            return state;
        });
    });
}
class SpikemuthGym extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'SVOM';
        this.setNumber = '19';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'I';
        this.name = 'Spikemuth Gym';
        this.fullName = 'Spikemuth Gym SVOM';
        this.text = 'Once during each player\'s turn, that player may search their deck for a Marnie\'s Pokémon, ' +
            'reveal it, and put it into their hand. Then, that player shuffles their deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const generator = useStadium(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.SpikemuthGym = SpikemuthGym;
