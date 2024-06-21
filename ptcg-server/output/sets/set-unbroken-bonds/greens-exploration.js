"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreensExploration = void 0;
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class GreensExploration extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '175';
        this.name = 'Greens Exploration';
        this.fullName = 'Greens Exploration UNB';
        this.text = 'You can play this card only if you have no Pokémon with Abilities in play.' +
            '' +
            'Search your deck for up to 2 Trainer cards, reveal them, and put them into your hand. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const benchPokemon = player.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined);
            const pokemonWithAbilities = benchPokemon.filter(card => card.powers.length);
            const playerActive = player.active.getPokemonCard();
            if (playerActive && playerActive.powers.length) {
                pokemonWithAbilities.push(playerActive);
            }
            if (pokemonWithAbilities.length > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.deck, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 2, allowCancel: false }), cards => {
                cards = cards || [];
                if (cards.length > 0) {
                    player.deck.moveCardsTo(cards, player.hand);
                    state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                    cards.forEach((card, index) => {
                        store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                    });
                }
                return state;
            });
        }
        return state;
    }
}
exports.GreensExploration = GreensExploration;
