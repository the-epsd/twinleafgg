"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tyme = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    let isPokemonInHand = false;
    player.hand.cards.forEach(card => {
        if (card instanceof game_1.PokemonCard) {
            isPokemonInHand = true;
        }
    });
    if (!isPokemonInHand) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    if (player.supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    // loading up all of the choices
    const options = [
        { value: 10, message: '10' }
    ];
    for (let i = 2; i <= 50; i++) {
        options.push({ value: 10 * i, message: '' + 10 * i });
    }
    const selectedPokemon = new game_1.CardList();
    let pokemonName = '';
    let pokemonHP = 0;
    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.hand, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: false }), selected => {
        selected.forEach(card => {
            if (card instanceof game_1.PokemonCard) {
                pokemonName = card.name;
                pokemonHP = card.hp;
                player.hand.moveCardTo(card, selectedPokemon);
            }
        });
        // dang if only i knew how to log something entirely unique
        store.log(state, game_message_1.GameLog.LOG_PLAYER_RETURNS_CARD_TO_HAND, { name: player.name, card: pokemonName });
        return store.prompt(state, new game_1.SelectPrompt(opponent.id, game_message_1.GameMessage.CHOOSE_OPTION, options.map(c => c.message), { allowCancel: false }), choice => {
            const option = options[choice];
            store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selectedPokemon.cards), () => {
                if (option.value === pokemonHP) {
                    opponent.deck.moveTo(opponent.hand, 4);
                    selectedPokemon.moveTo(player.hand);
                }
                else {
                    player.deck.moveTo(player.hand, 4);
                    selectedPokemon.moveTo(player.hand);
                }
            });
            player.supporter.moveTo(player.discard);
        });
    });
}
class Tyme extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SSP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '190';
        this.regulationMark = 'H';
        this.name = 'Tyme';
        this.fullName = 'Tyme SSP';
        this.text = 'Tell your opponent the name of a Pokémon in your hand and put that Pokémon face down in front of you. Your opponent guesses that Pokémon\'s HP, and then you reveal it. If your opponent guessed right, they draw 4 cards. If they guessed wrong, you draw 4 cards. Then, return the Pokémon to your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Tyme = Tyme;
