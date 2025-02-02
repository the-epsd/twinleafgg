"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zorua = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
function* useAscension(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.STAGE_1, evolvesFrom: 'Zorua' }, { min: 1, max: 1, allowCancel: true }), selected => {
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
class Zorua extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Ascension',
                cost: [card_types_1.CardType.DARK],
                damage: 0,
                text: 'Search your deck for a card that evolves from this Pokemon ' +
                    'and put it onto this Pokemon. (This counts as evolving this Pokemon.) ' +
                    'Shuffle your deck afterward.'
            }, {
                name: 'Scratch',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.set = 'DEX';
        this.name = 'Zorua';
        this.fullName = 'Zorua DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '69';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useAscension(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Zorua = Zorua;
