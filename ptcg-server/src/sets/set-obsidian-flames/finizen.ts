import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage, ShuffleDeckPrompt, ChoosePokemonPrompt, PlayerType, SlotType, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, EvolveEffect } from '../../game/store/effects/game-effects';

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

export class Finizen extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 50;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Valiant Evolution',
      cost: [CardType.WATER],
      damage: 0,
      text: 'Switch this Pokémon with 1 of your Benched Pokémon. If you do, search your deck for a card that evolves from this Pokémon and put it onto this Pokémon to evolve it. Then, shuffle your deck.'
    },
    {
      name: 'Razor Fin',
      cost: [CardType.WATER],
      damage: 10,
      text: ''
    },
  ];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '60';

  public name: string = 'Finizen';

  public fullName: string = 'Finizen OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const hasBenched = player.bench.some(b => b.cards.length > 0);

      if (!hasBenched) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false },
      ), selected => {
        if (!selected || selected.length === 0) {
          return state;
        }
        const target = selected[0];
        player.switchPokemon(target);

        let cards: PokemonCard[] = [];

        state = store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_EVOLVE,
          player.deck,
          { superType: SuperType.POKEMON, stage: Stage.STAGE_1, evolvesFrom: 'Finizen' },
          { min: 0, max: 1, allowCancel: false }
        ), selected => {
          cards = (selected || []) as PokemonCard[];

          // Find Finizen's new location after the switch
          let finizensNewBenchIndex = -1;
          player.bench.forEach((benchSpot, index) => {
            if (benchSpot.cards.includes(this)) {
              finizensNewBenchIndex = index;
            }
          });

          if (!selected || selected.length === 0) {
            return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
              player.deck.applyOrder(order);
            });
          }

          // Move the evolution card from deck to bench first
          player.deck.moveCardTo(cards[0], player.bench[finizensNewBenchIndex]);

          const evolveEffect = new EvolveEffect(player, player.bench[finizensNewBenchIndex], cards[0]);
          store.reduceEffect(state, evolveEffect);

          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
          });
        });
      });
    }
    return state;
  }
}
