import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Cosmoem extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Cosmog';
  public hp: number = 100;
  public cardType: CardType[] = [P];
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Stiffen',
    cost: [C, C],
    damage: 0,
    text: 'During your opponent\'s next turn, this Pokémon takes 60 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';
  public name: string = 'Cosmoem';
  public fullName: string = 'Cosmoem 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Stiffen
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = 60;
    }

    return state;
  }
}
