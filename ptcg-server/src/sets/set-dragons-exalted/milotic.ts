import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Milotic extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Feebas';
  public cardType: CardType = W;
  public hp: number = 110;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Clear Search',
      cost: [W],
      damage: 0,
      text: 'Search your deck for any 3 cards and put them into your hand. Shuffle your deck afterward.'
    },
    {
      name: 'Water Pulse',
      cost: [W, C, C],
      damage: 60,
      text: 'The Defending Pokémon is now Asleep.'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '28';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Milotic';
  public fullName: string = 'Milotic DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Clear Search - search deck for any 3 cards
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        {},
        { min: 0, max: 3, allowCancel: true },
        this.attacks[0]
      );
    }

    // Water Pulse - Asleep
    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
