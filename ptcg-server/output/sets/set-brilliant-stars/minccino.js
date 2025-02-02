"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minccino = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useCallForFamily(next, store, state, effect) {
    const player = effect.player;
    const slots = player.bench.filter(b => b.cards.length === 0);
    const max = Math.min(slots.length, 2);
    if (slots.length === 0) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max, allowCancel: false }), selected => {
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
class Minccino extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Call For Family',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for up to 2 Basic Pokémon and put them onto your Bench. Then, shuffle your deck.'
            },
            {
                name: 'Pound',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '124';
        this.name = 'Minccino';
        this.fullName = 'Minccino BRS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useCallForFamily(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Minccino = Minccino;
