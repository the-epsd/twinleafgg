import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Mabosstiff extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Maschiff';
  public cardType: CardType = D;
  public hp: number = 140;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Bite',
    cost: [D, D],
    damage: 60,
    text: '',
  },
  {
    name: 'Plunging Headbutt',
    cost: [D, D, D],
    damage: 210,
    text: 'During your opponent\'s next turn, this Pokémon takes 100 extra damage from attacks (after applying Weakness and Resistance).',
  }];

  public regulationMark: string = 'J';
  public set: string = 'PBL';
  public setNumber: string = '58';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mabosstiff';
  public fullName: string = 'Mabosstiff M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Plunging Headbutt
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.damageReductionNextTurn = -100;
    }

    return state;
  }
}
