"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Krabby = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useCallForFamily(next, store, state, effect) {
    const player = effect.player;
    const slots = player.bench.filter(b => b.cards.length === 0);
    const max = Math.min(slots.length, 1);
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC, name: 'Krabby' }, { min: 0, max, allowCancel: true }), selected => {
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
class Krabby extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Call for Family',
                cost: [W],
                damage: 0,
                text: 'Search your deck for a Basic Pokémon named Krabby and put it onto your Bench. Shuffle your deck afterward. (You can\'t use this attack if your Bench if full.)'
            },
            {
                name: 'Irongrip',
                cost: [W, C],
                damage: 20,
                text: ''
            }];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
        this.name = 'Krabby';
        this.fullName = 'Krabby FO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const generator = useCallForFamily(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Krabby = Krabby;
