"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LilliesComfy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useCallForFamily(next, store, state, effect) {
    const player = effect.player;
    const slots = player.bench.filter(b => b.cards.length === 0);
    const max = Math.min(slots.length);
    if (max === 0) {
        return state;
    }
    const blocked = [];
    player.deck.cards.forEach((card, index) => {
        if (card instanceof pokemon_card_1.PokemonCard && !card.tags.includes(card_types_1.CardTag.LILLIES)) {
            blocked.push(index);
        }
    });
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: max, allowCancel: false, blocked }), selected => {
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
class LilliesComfy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.LILLIES];
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Flower Call',
                cost: [C],
                damage: 0,
                text: 'Search your deck for any number of Basic Lillie\'s Pokémon and put them onto your Bench. Then, shuffle your deck.'
            },
            {
                name: 'Tackle',
                cost: [P],
                damage: 30,
                text: 'Put this Pokémon and all attached cards into your hand.'
            }
        ];
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.set = 'SV9';
        this.setNumber = '43';
        this.name = 'Lillie\'s Comfey';
        this.fullName = 'Lillie\'s Comfy SV9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useCallForFamily(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.LilliesComfy = LilliesComfy;
