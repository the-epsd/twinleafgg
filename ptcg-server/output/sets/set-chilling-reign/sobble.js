"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sobble = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useKeepCalling(next, store, state, effect) {
    const player = effect.player;
    const slots = player.bench.filter(b => b.cards.length === 0);
    const max = Math.min(slots.length, 3);
    const blocked = [];
    for (let i = 0; i < player.deck.cards.length; i++) {
        const card = player.deck.cards[i];
        if (!card.tags.includes(card_types_1.CardTag.RAPID_STRIKE)) {
            blocked.push(i);
        }
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max, allowCancel: false, blocked }), selected => {
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
class Sobble extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.tags = [card_types_1.CardTag.RAPID_STRIKE];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Keep Calling',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for up to 3 Basic Rapid Strike Pokémon and put them onto your Bench. Then, shuffle your deck.'
            },
            {
                name: 'Double Spin',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Flip 2 coins. This attack does 20 damage for each heads.'
            }
        ];
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Sobble';
        this.fullName = 'Sobble CRE';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useKeepCalling(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 20 * heads;
            });
        }
        return state;
    }
}
exports.Sobble = Sobble;
