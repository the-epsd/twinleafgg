"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwistMountain = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
function* useStadium(next, store, state, effect) {
    const player = effect.player;
    const slots = player.bench.filter(b => b.cards.length === 0);
    const hasRestored = player.hand.cards.some(c => {
        return c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.RESTORED;
    });
    if (slots.length === 0 || !hasRestored) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
    }
    let flipResult = false;
    yield store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), result => {
        flipResult = result;
        next();
    });
    if (!flipResult) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.hand, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.RESTORED }, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > slots.length) {
        cards.length = slots.length;
    }
    cards.forEach((card, index) => {
        player.hand.moveCardTo(card, slots[index]);
        slots[index].pokemonPlayedTurn = state.turn;
    });
    return state;
}
class TwistMountain extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'DEX';
        this.name = 'Twist Mountain';
        this.fullName = 'Twist Mountain DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '101';
        this.text = 'Once during each player\'s turn, that player may flip a coin. ' +
            'If heads, the player puts a Restored Pokemon from his or her hand ' +
            'onto his or her Bench.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const generator = useStadium(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.TwistMountain = TwistMountain;
