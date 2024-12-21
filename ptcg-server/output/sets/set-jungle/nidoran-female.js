"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NidoranFemale = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
function* useCallForFamily(next, store, state, effect) {
    const player = effect.player;
    const slots = player.bench.filter(b => b.cards.length === 0);
    const max = Math.min(slots.length, 1);
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC, name: 'Nidoran ♀' || 'Nidoran ♂' }, { min: 0, max, allowCancel: false }), selected => {
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
class NidoranFemale extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Nidoran F';
        this.cardImage = 'assets/cardback.png';
        this.set = 'JU';
        this.setNumber = '57';
        this.fullName = 'Nidoran F JU';
        this.cardType = card_types_1.CardType.GRASS;
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Fury Swipes',
                cost: [card_types_1.CardType.GRASS],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 10 damage times the number of heads.'
            },
            {
                name: 'Call for Family',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 0,
                text: 'Search your deck for a Basic Pokémon named Nidoran Male or Nidoran Female and put it onto your Bench. Shuffle your deck afterward. (You can\'t use this attack if your Bench is full.)'
            },
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            return store.prompt(state, [
                new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP),
                new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP),
                new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP)
            ], (results) => {
                const heads = results.filter(r => !!r).length;
                effect.damage = heads * 10;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const generator = useCallForFamily(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.NidoranFemale = NidoranFemale;
