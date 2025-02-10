"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Applin = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useFindAFriend(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    cards.forEach((card, index) => {
        player.deck.moveCardTo(card, player.hand);
    });
    state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Applin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 40;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Find a Friend',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Rolling Tackle',
                cost: [G, R],
                damage: 30,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'TWM';
        this.setNumber = '126';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Applin';
        this.fullName = 'Applin TWM2';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useFindAFriend(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Applin = Applin;
