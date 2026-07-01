import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {
  DISCARD_DEFENDING_POKEMON_AT_END_OF_OPPONENTS_NEXT_TURN,
  YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED,
} from '../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Jynx extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Wicked Kiss',
    cost: [P],
    damage: 0,
    text: 'At the end of your opponent\'s next turn, discard the Defending Pokémon and all cards attached to it.',
  },
  {
    name: 'Psyshock',
    cost: [P, C],
    damage: 50,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.',
  }];

  public set: string = 'M5';
  public setNumber: string = '30';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Jynx';
  public fullName: string = 'Jynx M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_DEFENDING_POKEMON_AT_END_OF_OPPONENTS_NEXT_TURN(effect, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, heads => {
        if (heads) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    return state;
  }
}
