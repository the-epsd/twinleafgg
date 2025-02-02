"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Finizen = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
// function* useAscension(next: Function, store: StoreLike, state: State,
//   effect: AttackEffect): IterableIterator<State> {
//   const player = effect.player;
//   const hasBenched = player.bench.some(b => b.cards.length > 0);
//   if (!hasBenched) {
//     throw new GameError(GameMessage.CANNOT_USE_ATTACK);
//   }
//   if (player.deck.cards.length === 0) {
//     throw new GameError(GameMessage.CANNOT_USE_ATTACK);
//   }
//   const cardList = StateUtils.findCardList(state, this);
//   const benchIndex = player.bench.indexOf(cardList as PokemonCardList);
//   if (benchIndex === -1) {
//     throw new GameError(GameMessage.CANNOT_USE_POWER);
//   }
//   yield store.prompt(state, new ChoosePokemonPrompt(
//     player.id,
//     GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
//     PlayerType.BOTTOM_PLAYER,
//     [SlotType.BENCH],
//     { allowCancel: false },
//   ), selected => {
//     if (!selected || selected.length === 0) {
//       return state;
//     }
//     const target = selected[0];
//     player.switchPokemon(target);
//     let cards: Card[] = [];
//     state = store.prompt(state, new ChooseCardsPrompt(
//       player.id,
//       GameMessage.CHOOSE_CARD_TO_EVOLVE,
//       player.deck,
//       { superType: SuperType.POKEMON, stage: Stage.STAGE_1, evolvesFrom: 'Finizen' },
//       { min: 1, max: 1, allowCancel: true }
//     ), selected => {
//       cards = selected || [];
//       next();
//     });
//     if (cards.length > 0) {
//       // Evolve Pokemon
//       player.deck.moveCardsTo(cards, player.bench[benchIndex]);
//       player.bench[benchIndex].clearEffects();
//       player.bench[benchIndex].pokemonPlayedTurn = state.turn;
//     }
//     return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
//       player.deck.applyOrder(order);
//     });
//   });
// }
class Finizen extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Valiant Evolution',
                cost: [card_types_1.CardType.WATER],
                damage: 0,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon. If you do, search your deck for a card that evolves from this Pokémon and put it onto this Pokémon to evolve it. Then, shuffle your deck.'
            },
            {
                name: 'Razor Fin',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: ''
            },
        ];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.name = 'Finizen';
        this.fullName = 'Finizen OBF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), selected => {
                if (!selected || selected.length === 0) {
                    return state;
                }
                const target = selected[0];
                player.switchPokemon(target);
                let cards = [];
                state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.STAGE_1, evolvesFrom: 'Finizen' }, { min: 0, max: 1, allowCancel: false }), selected => {
                    cards = (selected || []);
                    // Find Finizen's new location after the switch
                    let finizensNewBenchIndex = -1;
                    player.bench.forEach((benchSpot, index) => {
                        if (benchSpot.cards.includes(this)) {
                            finizensNewBenchIndex = index;
                        }
                    });
                    if (!selected || selected.length === 0) {
                        return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                            player.deck.applyOrder(order);
                        });
                    }
                    // Move the evolution card from deck to bench first
                    player.deck.moveCardTo(cards[0], player.bench[finizensNewBenchIndex]);
                    const evolveEffect = new game_effects_1.EvolveEffect(player, player.bench[finizensNewBenchIndex], cards[0]);
                    store.reduceEffect(state, evolveEffect);
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                });
            });
        }
        return state;
    }
}
exports.Finizen = Finizen;
