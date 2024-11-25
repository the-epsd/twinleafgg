"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weedle = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useMultiply(next, store, state, effect) {
    const player = effect.player;
    const slots = player.bench.filter(b => b.cards.length === 0);
    if (slots.length == 0) {
        return state;
    } // Attack does nothing if no bench slots.
    const max = Math.min(slots.length, 1);
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: game_1.SuperType.POKEMON, stage: game_1.Stage.BASIC, name: 'Weedle' }, { min: 0, max, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    cards.forEach((card, index) => {
        player.deck.moveCardTo(card, slots[index]);
        slots[index].pokemonPlayedTurn = state.turn;
    });
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Weedle extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.GRASS;
        this.hp = 50;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Multiply',
                cost: [game_1.CardType.GRASS],
                damage: 0,
                text: 'Search your deck for Weedle and put it onto your Bench. Shuffle your deck afterward.'
            },
        ];
        this.set = 'PRC';
        this.name = 'Weedle';
        this.fullName = 'Weedle PRC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '1';
    }
    reduceEffect(store, state, effect) {
        // Multiply
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useMultiply(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Weedle = Weedle;
