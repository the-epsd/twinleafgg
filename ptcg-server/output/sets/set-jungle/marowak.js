"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marowak = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Marowak extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.resistance = [{ type: card_types_1.CardType.LIGHTNING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Cubone';
        this.attacks = [{
                name: 'Bonemerang',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
            },
            {
                name: 'Call for Friend',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for a {F} Basic Pokémon card and put it onto your Bench. Shuffle your deck afterward. (You can\'t use this attack if your Bench is full.)'
            }];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
        this.name = 'Marowak';
        this.fullName = 'Marowak JU';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 30 * heads;
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const slots = player.bench.filter(b => b.cards.length === 0);
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC, cardType: card_types_1.CardType.FIGHTING }, { min: 1, max: 1, allowCancel: true }), selected => {
                cards = selected || [];
                // Taking no Pokemon off of Call for Family
                if (cards.length === 0) {
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                }
                cards.forEach((card, index) => {
                    player.deck.moveCardTo(card, slots[index]);
                    slots[index].pokemonPlayedTurn = state.turn;
                });
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Marowak = Marowak;
