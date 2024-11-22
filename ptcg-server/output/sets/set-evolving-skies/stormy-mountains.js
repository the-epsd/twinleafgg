"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StormyMountains = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
function* useStadium(next, store, state, effect) {
    const player = effect.player;
    const slots = player.bench.filter(b => b.cards.length === 0);
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (slots.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const blocked = [];
    player.deck.cards.forEach((card, index) => {
        if (!(card instanceof game_1.PokemonCard && (card.cardType === card_types_1.CardType.DRAGON || card.cardType === card_types_1.CardType.LIGHTNING))) {
            blocked.push(index);
        }
    });
    let cards = [];
    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: 1, allowCancel: false, blocked }), selectedCards => {
        cards = selectedCards || [];
        // Operation canceled by the user
        if (cards.length === 0) {
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        }
        cards.forEach((card, index) => {
            player.deck.moveCardTo(card, slots[index]);
            slots[index].pokemonPlayedTurn = state.turn;
        });
        return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
            return state;
        });
    });
}
class StormyMountains extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '161';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'EVS';
        this.name = 'Stormy Mountains';
        this.fullName = 'Stormy Mountains EVS';
        this.text = 'Once during each player\'s turn, that player may search their deck for a Basic [L] Pokémon or Basic [N] Pokémon and put it onto their Bench. Then, that player shuffles their deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const generator = useStadium(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.StormyMountains = StormyMountains;
