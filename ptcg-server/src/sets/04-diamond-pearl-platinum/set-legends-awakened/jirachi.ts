import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { CardList, ChooseCardsPrompt, GameMessage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { KNOCK_OUT_DEFENDING_POKEMON_AT_END_OF_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/attack-effects';
import { DISCARD_ALL_ENERGY_FROM_POKEMON, MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Jirachi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'One Desire',
    cost: [],
    damage: 0,
    text: 'Search your deck for any 1 card. Shuffle your deck, then put that card on top of your deck.'
  },
  {
    name: 'Doom Desire',
    cost: [M, M],
    damage: 0,
    text: 'Discard all Energy attached to Jirachi. The Defending Pokémon is Knocked Out at the end of your opponent\'s next turn.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';
  public name: string = 'Jirachi';
  public fullName: string = 'Jirachi LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // One Desire
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.deck.cards.length === 0) {
        return state;
      }
      const deckTop = new CardList();
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARDS,
        player.deck,
        {},
        { min: 1, max: 1, allowCancel: false },
      ), selected => {
        const cards = selected || [];
        if (cards.length === 0) {
          return;
        }
        MOVE_CARDS(store, state, player.deck, deckTop, { cards, sourceCard: this });
        SHUFFLE_DECK(store, state, player);
        store.waitPrompt(state, () => {
          MOVE_CARDS(store, state, deckTop, player.deck, { cards: deckTop.cards, sourceCard: this });
        });
      });
    }

    // Doom Desire
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, effect.player.active.getPokemonCard()!);
      KNOCK_OUT_DEFENDING_POKEMON_AT_END_OF_OPPONENTS_NEXT_TURN(store, state, effect, this);
    }

    return state;
  }
}
