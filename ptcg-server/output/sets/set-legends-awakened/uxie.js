"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uxie = void 0;
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const order_cards_prompt_1 = require("../../game/store/prompts/order-cards-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
function* usePsychicRestore(next, store, state, effect) {
    const player = effect.player;
    const target = player.active;
    let wantToUse = false;
    yield store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_SHUFFLE_POKEMON_INTO_DECK), result => {
        wantToUse = result;
        next();
    });
    if (!wantToUse) {
        return state;
    }
    return store.prompt(state, new order_cards_prompt_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, target, { allowCancel: true }), order => {
        if (order === null) {
            return state;
        }
        target.applyOrder(order);
        target.moveTo(player.deck);
    });
}
class Uxie extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC, value: 20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Set Up',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Uxie from your hand onto ' +
                    'your Bench, you may draw cards until you have 7 cards in your hand.'
            }];
        this.attacks = [
            {
                name: 'Psychic Restore',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'You may put Uxie and all cards attached to it on the bottom of ' +
                    'your deck in any order.'
            }
        ];
        this.set = 'LA';
        this.name = 'Uxie';
        this.fullName = 'Uxie LA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '43';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const cards = player.hand.cards.filter(c => c !== this);
            const cardsToDraw = Math.max(0, 7 - cards.length);
            if (cardsToDraw === 0) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            return store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    player.deck.moveTo(player.hand, cardsToDraw);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = usePsychicRestore(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Uxie = Uxie;
