"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeedleCPA = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useCallForFamily(next, store, state, effect) {
    const player = effect.player;
    const slots = player.bench.filter(b => b.cards.length === 0);
    if (slots.length == 0) {
        return state;
    } // Attack does nothing if no bench slots.
    const max = Math.min(slots.length, 1);
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: game_1.SuperType.POKEMON, stage: game_1.Stage.BASIC }, { min: 0, max, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > slots.length) {
        cards.length = slots.length;
    }
    cards.forEach((card, index) => {
        player.deck.moveCardTo(card, slots[index]);
        slots[index].pokemonPlayedTurn = state.turn;
    });
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class WeedleCPA extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.GRASS;
        this.hp = 60;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.set = 'CPA';
        this.setNumber = '2';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'D';
        this.name = 'Weedle';
        this.fullName = 'Weedle CPA';
        this.attacks = [
            {
                name: 'Call for Family',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for a Basic Pokemon and put it onto your Bench. Then, shuffle your deck. '
            },
        ];
    }
    reduceEffect(store, state, effect) {
        // Call for Family
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useCallForFamily(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.WeedleCPA = WeedleCPA;
