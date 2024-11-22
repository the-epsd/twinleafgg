"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Croagunk = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
function* useKnockOff(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    // Opponent has no cards in the hand
    if (opponent.hand.cards.length === 0) {
        return state;
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
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { min: 1, max: 1, allowCancel: false, isSecret: true }), selected => {
        cards = selected || [];
        next();
    });
    opponent.hand.moveCardsTo(cards, opponent.discard);
    return state;
}
class Croagunk extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 60;
        this.weakness = [{
                type: card_types_1.CardType.PSYCHIC,
                value: 10
            }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Knock Off',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Flip a coin. If heads, choose 1 card from your opponent\'s hand ' +
                    'without looking and discard it.'
            }, {
                name: 'Nimble',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 30,
                text: 'If you have Turtwig in play, remove from Croagunk the number of ' +
                    'damage counters equal to the damage you did to the Defending Pokemon.'
            }];
        this.set = 'OP9';
        this.name = 'Croagunk';
        this.fullName = 'Croagunk OP9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useKnockOff(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let isTurtwigInPlay = false;
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Turtwig') {
                    isTurtwigInPlay = true;
                }
            });
            if (!isTurtwigInPlay) {
                return state;
            }
            const healEffect = new attack_effects_1.HealTargetEffect(effect.attackEffect, effect.damage);
            healEffect.target = player.active;
            return store.reduceEffect(state, healEffect);
        }
        return state;
    }
}
exports.Croagunk = Croagunk;
