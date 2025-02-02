"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Axew = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_message_1 = require("../../game/game-message");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
function* useUltraEvolution(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.STAGE_2, evolvesFrom: 'Fraxure' }, { min: 1, max: 1, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > 0) {
        // Evolve Pokemon
        player.deck.moveCardsTo(cards, player.active);
        player.active.clearEffects();
        player.active.pokemonPlayedTurn = state.turn;
    }
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Axew extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 60;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Ultra Evolution',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Flip a coin. If heads, search your deck for a Haxorus and put it onto this Axew to evolve it. THen shuffle your deck.'
            }];
        this.regulationMark = 'F';
        this.set = 'BRS';
        this.name = 'Axew';
        this.fullName = 'Axew BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '110';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    const generator = useUltraEvolution(() => generator.next(), store, state, effect);
                    return generator.next().value;
                }
            });
        }
        return state;
    }
}
exports.Axew = Axew;
