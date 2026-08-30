import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_KNOCKED_OUT_IF_DAMAGED_DURING_YOUR_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Aegislash extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Doublade';
  public cardType: CardType[] = [P];
  public hp: number = 150;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Ticking Knock Out',
    cost: [C],
    damage: 0,
    text: 'During your next turn, if the Defending Pokémon is damaged by an attack, it will be Knocked Out.',
  }, {
    name: 'Draining Blade',
    cost: [P, P, P],
    damage: 90,
    text: 'Heal 30 damage from this Pokémon.',
  }];

  public set: string = 'FLI';
  public setNumber: string = '49';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Aegislash';
  public fullName: string = 'Aegislash FLI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_KNOCKED_OUT_IF_DAMAGED_DURING_YOUR_NEXT_TURN(store, state, effect, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(30, effect, store, state);
    }

    return state;
  }
}
