import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';

export class Wobbuffet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: 20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Countercharge',
    cost: [P, C],
    damage: 0,
    text: 'Flip a coin. If heads, move all damage counters from Wobbuffet to the Defending Pokémon.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Wobbuffet';
  public fullName: string = 'Wobbuffet DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Countercharge
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const damage = player.active.damage;

      if (damage === 0) {
        return state;
      }

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          player.active.damage = 0;
          const putCounters = new PutCountersEffect(effect, damage);
          putCounters.target = effect.opponent.active;
          store.reduceEffect(state, putCounters);
        }
      });
    }

    return state;
  }
}
