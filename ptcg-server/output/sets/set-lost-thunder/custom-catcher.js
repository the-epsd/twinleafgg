"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomCatcher = void 0;
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const name = effect.trainerCard.name;
    // Don't allow to play both cross switchers when opponen has an empty bench
    const benchCount = opponent.bench.reduce((sum, b) => {
        return sum + (b.cards.length > 0 ? 1 : 0);
    }, 0);
    //let playTwoCards = false;
    if (benchCount > 0) {
        // playTwoCards = true;
        // Discard second Cross Switcher +
        const second = player.hand.cards.find(c => {
            return c.name === name && c !== effect.trainerCard;
        });
        if (second !== undefined) {
            player.hand.moveCardTo(second, player.discard);
        }
        const hasBench = player.bench.some(b => b.cards.length > 0);
        if (hasBench === false) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
        }
        // We will discard this card after prompt confirmation
        effect.preventDefault = true;
        return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
            if (!targets || targets.length === 0) {
                return;
            }
            opponent.active.clearEffects();
            opponent.switchPokemon(targets[0]);
            next();
            // Do not discard the card yet
            effect.preventDefault = true;
            let target = [];
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), results => {
                target = results || [];
                next();
                if (target.length === 0) {
                    return state;
                }
                // Discard trainer only when user selected a Pokemon
                player.active.clearEffects();
                player.switchPokemon(target[0]);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            });
        });
    }
}
class CustomCatcher extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'LOT';
        this.name = 'Custom Catcher';
        this.fullName = 'Custom Catcher LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '171';
        this.text = 'You may play 2 Custom Catcher cards at once.' +
            '' +
            '• If you played 1 card, draw cards until you have 3 cards in your hand.' +
            '• If you played 2 cards, switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon. (This effect works one time for 2 cards.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            let drawUpToThree = false;
            const count = player.hand.cards.reduce((sum, c) => {
                return sum + (c.name === this.name ? 1 : 0);
            }, 0);
            if (count > 1) {
                state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_message_1.GameMessage.WANT_TO_PLAY_BOTH_CARDS_AT_ONCE), wantToUse => {
                    if (!wantToUse) {
                        drawUpToThree = true;
                    }
                    else {
                        const generator = playCard(() => generator.next(), store, state, effect);
                        return generator.next().value;
                    }
                });
            }
            else {
                drawUpToThree = true;
            }
            if (drawUpToThree) {
                const cards = player.hand.cards.filter(c => c !== this);
                const cardsToDraw = Math.max(0, 3 - cards.length);
                if (cardsToDraw === 0 || player.deck.cards.length === 0) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                }
                player.deck.moveTo(player.hand, cardsToDraw);
                for (let i = 0; i < cardsToDraw; i++) {
                    store.log(state, game_message_1.GameLog.LOG_PLAYER_DRAWS_CARD, { name: player.name });
                }
            }
        }
        return state;
    }
}
exports.CustomCatcher = CustomCatcher;
