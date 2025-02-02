"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Froakie = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
class Froakie extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Flock',
                cost: [card_types_1.CardType.WATER],
                damage: 0,
                text: 'Search your deck for up to 2 Froakie and put them onto your Bench. Then, shuffle your deck.'
            },
            {
                name: 'Hop Around',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'SV5';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
        this.name = 'Froakie';
        this.fullName = 'Froakie SV5';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const slots = player.bench.filter(b => b.cards.length === 0);
            const max = Math.min(slots.length, 2);
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC, name: 'Froakie' }, { min: 0, max, allowCancel: true }), selected => {
                cards = selected || [];
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
        return state;
    }
}
exports.Froakie = Froakie;
