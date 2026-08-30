import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { BLOCK_SELF_RETREAT } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Slakoth extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Take It Easy',
    cost: [C],
    damage: 0,
    text: 'Heal 60 damage from this Pokemon. During your next turn, this Pokemon can\'t retreat.'
  }];

  public set: string = 'SSP';
  public setNumber = '145';
  public cardImage = 'assets/cardback.png';
  public regulationMark: string = 'H';
  public name: string = 'Slakoth';
  public fullName: string = 'Slakoth SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Take It Easy
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 60);
      BLOCK_SELF_RETREAT(store, state, effect, this);
    }

    return state;
  }
}