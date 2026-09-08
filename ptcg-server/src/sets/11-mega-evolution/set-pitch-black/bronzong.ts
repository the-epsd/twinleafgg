import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Bronzong extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Bronzor';
  public cardType: CardType[] = [M];
  public hp: number = 130;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Gentle Slap',
    cost: [M],
    damage: 40,
    text: ''
  },
  {
    name: 'Metal Block',
    cost: [M, M, C],
    damage: 120,
    text: 'During your opponent\'s next turn, this Pokémon takes 100 less damage from attacks from Evolution Pokémon.'
  }];

  public regulationMark = 'J';
  public set: string = 'PBL';
  public setNumber: string = '64';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bronzong';
  public fullName: string = 'Bronzong M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Metal Block
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.damageReductionNextTurn = 100;
      effect.player.active.damageReductionNextTurnFilter = { sourceIsEvolution: true };
    }

    return state;
  }
}
