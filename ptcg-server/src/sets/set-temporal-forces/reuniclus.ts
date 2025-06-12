import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CardList, ChooseCardsPrompt, GameError, GameMessage, ShuffleDeckPrompt } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class Reuniclus extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Duosion';

  public regulationMark = 'H';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 120;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Summoning Gate',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Look at the top 8 cards of your deck and put any number of Pokémon you find there onto your Bench. Shuffle the other cards into your deck.'
    },
    {
      name: 'Brain Shake',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: 100,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '72';

  public name: string = 'Reuniclus';

  public fullName: string = 'Reuniclus TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const openSlots = player.bench.filter(b => b.cards.length === 0);

      if (player.deck.cards.length === 0 || openSlots.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Count Pokemon in top 8 cards and track non-Pokemon positions
      const blocked: number[] = [];
      let pokemonCount = 0;
      player.deck.cards.forEach((c, index) => {
        if (c instanceof PokemonCard) {
          pokemonCount += 1;
        } else {
          blocked.push(index);
        }
      });

      const maxPokemons = Math.min(pokemonCount, openSlots.length);
      const deckTop = new CardList();
      MOVE_CARDS(store, state, player.deck, deckTop, { count: 8 });

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        deckTop,
        { superType: SuperType.POKEMON },
        { min: 0, max: openSlots.length, allowCancel: false, blocked, maxPokemons }
      ), selectedCards => {
        const cards = selectedCards || [];

        // Move selected cards to open bench slots
        cards.forEach((card, index) => {
          const targetSlot = openSlots[index];
          MOVE_CARDS(store, state, deckTop, targetSlot, { cards: [card] });
          targetSlot.pokemonPlayedTurn = state.turn;
        });

        // Move remaining cards back to deck
        MOVE_CARDS(store, state, deckTop, player.deck);

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
          return state;
        });
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
    }
    return state;
  }
}
