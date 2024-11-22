"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cascoon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
function* useFlock(next, store, state, effect) {
    const player = effect.player;
    const slots = player.bench.filter(b => b.cards.length === 0);
    const max = Math.min(slots.length, 1);
    const blocked = [];
    player.deck.cards.forEach((card, index) => {
        if (card instanceof pokemon_card_1.PokemonCard &&
            !['Silcoon', 'Cascoon'].includes(card.name)) {
            blocked.push(index);
        }
    });
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max, allowCancel: false, blocked }), selected => {
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
class Cascoon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Wurmple';
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Cocoon Collector',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 4 in any combination of Silcoon and Cascoon and put them onto your Bench. Then, shuffle your deck.'
            },
            {
                name: 'Ram',
                cost: [G, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'LOT';
        this.setNumber = '27';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cascoon';
        this.fullName = 'Cascoon LOT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useFlock(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Cascoon = Cascoon;
