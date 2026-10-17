import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../../game/store/prefabs/attack-effects';

export class Hypno extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Drowzee';
  public hp: number = 80;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Dream Catcher',
    cost: [C, C],
    damage: 0,
    text: 'If the Defending Pokémon is Asleep, move all damage counters from Hypno to the Defending Pokémon.'
  },
  {
    name: 'Hypnoblast',
    cost: [P, P, C],
    damage: 60,
    text: 'The Defending Pokémon is now Asleep.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '19';
  public name: string = 'Hypno';
  public fullName: string = 'Hypno GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dream Catcher
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      if (opponent.active.specialConditions.includes(SpecialCondition.ASLEEP)) {
        opponent.active.damage += player.active.damage;
        player.active.damage = 0;
      }
    }

    // Hypnoblast
    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    return state;
  }
}
