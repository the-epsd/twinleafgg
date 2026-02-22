import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
import { MOVED_TO_ACTIVE_THIS_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Rayquaza extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 120;
  public weakness = [];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Breakthrough Assault',
    cost: [L, C],
    damage: 20,
    damageCalculation: '+',
    text: 'If this Pokémon moved from your Bench to the Active Spot this turn, this attack does 90 more damage.'
  },
  {
    name: 'Dragon Claw',
    cost: [R, L, C],
    damage: 130,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '153';
  public name: string = 'Rayquaza';
  public fullName: string = 'Rayquaza M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (MOVED_TO_ACTIVE_THIS_TURN(effect.player, this)) {
        effect.damage += 90;
      }
    }

    return state;
  }
}