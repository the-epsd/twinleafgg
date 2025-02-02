import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Card, CardList, ChooseCardsPrompt, GameError, GameMessage, PokemonCardList, ShuffleDeckPrompt } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

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
      let pokemons = 0;

      const blocked: number[] = [];
      player.deck.cards.forEach((c, index) => {
        if (c instanceof PokemonCard) {
          pokemons += 1;
        } else {
          blocked.push(index);
        }
      });

      // Allow player to search deck and choose up to 2 Basic Pokemon
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      } else {
        // Check if bench has open slots
        const openSlots = player.bench.filter(b => b.cards.length === 0);

        if (openSlots.length === 0) {
          // No open slots, throw error
          throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
        }

        const maxPokemons = Math.min(pokemons, 8);

        const deckTop = new CardList();
        player.deck.moveTo(deckTop, 8);

        // We will discard this card after prompt confirmation
        effect.preventDefault = true;

        let cards: Card[] = [];
        return store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
          deckTop,
          { superType: SuperType.POKEMON },
          { min: 0, max: 8, allowCancel: false, blocked, maxPokemons }
        ), selectedCards => {
          cards = selectedCards || [];

          cards.forEach((card, index) => {
            deckTop.moveCardTo(card, slots[index]);
            slots[index].pokemonPlayedTurn = state.turn;
            deckTop.moveTo(player.deck);

          });

          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);

            return state;
          });
        });
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
    }
    return state;
  }
}
