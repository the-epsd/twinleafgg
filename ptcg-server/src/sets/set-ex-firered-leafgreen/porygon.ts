import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS_UNTIL_CARDS_IN_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../game/store/prefabs/attack-effects';

export class Porygon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Data Retrieval',
    cost: [C],
    damage: 0,
    text: 'If you have less than 4 cards in your hand, draw cards until you have 4 cards in your hand.'
  },
  {
    name: 'Confuse Ray',
    cost: [C, C],
    damage: 10,
    text: 'The Defending Pokémon is now Confused.'
  }];

  public set: string = 'RG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Porygon';
  public fullName: string = 'Porygon RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS_UNTIL_CARDS_IN_HAND(effect.player, 4);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
    }

    return state;
  }

}
