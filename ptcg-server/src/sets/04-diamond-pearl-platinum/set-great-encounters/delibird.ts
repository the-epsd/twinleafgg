import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Delibird extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [W];
  public weakness = [{ type: M, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Present',
    cost: [],
    damage: 0,
    text: 'Flip a coin. If heads, search your deck for any 1 card and put it into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Ice Ball',
    cost: [W],
    damage: 20,
    text: ''
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '36';
  public name: string = 'Delibird';
  public fullName: string = 'Delibird GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Present
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, effect.player, this, {}, { min: 0, max: 1, allowCancel: true });
        }
      });
    }

    return state;
  }
}
