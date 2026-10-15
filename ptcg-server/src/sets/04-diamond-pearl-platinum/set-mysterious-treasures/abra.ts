import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { CardList, ChooseCardsPrompt, GameMessage, PokemonCardList, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Abra extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Play Search',
    cost: [P],
    damage: 0,
    text: 'Look at the top 5 cards of your deck, choose 1 of them, and put it into your hand. Put the other 4 cards back on top of your deck. Shuffle your deck afterward.'
  }, {
    name: 'Ultra Evolution',
    cost: [P, C],
    damage: 0,
    text: 'Search your deck for Alakazam and put it on Abra (this counts as evolving Abra). Shuffle your deck afterward.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Abra';
  public fullName: string = 'Abra MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Play Search
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.deck.cards.length === 0) {
        return state;
      }

      const deckTop = new CardList();
      MOVE_CARDS(store, state, player.deck, deckTop, {
        count: Math.min(5, player.deck.cards.length),
        sourceCard: this,
      });

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        deckTop,
        {},
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        MOVE_CARDS(store, state, deckTop, player.hand, { cards: selected || [], sourceCard: this });
        MOVE_CARDS(store, state, deckTop, player.deck, { sourceCard: this });
        SHUFFLE_DECK(store, state, player);
      });
    }

    // Ultra Evolution
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (player.deck.cards.length === 0) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_EVOLVE,
        player.deck,
        { superType: SuperType.POKEMON, name: 'Alakazam' },
        { min: 0, max: 1, allowCancel: true }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          const target = StateUtils.findCardList(state, this) as PokemonCardList;
          MOVE_CARDS(store, state, player.deck, target, { cards, sourceCard: this });
          target.clearEffects();
          target.pokemonPlayedTurn = state.turn;
        }
        SHUFFLE_DECK(store, state, player);
      });
    }

    return state;
  }
}
