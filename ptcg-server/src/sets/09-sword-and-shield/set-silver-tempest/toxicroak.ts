import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Toxicroak extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Croagunk';
  public cardType: CardType[] = [D];
  public hp: number = 120;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Pierce',
    cost: [D],
    damage: 30,
    text: ''
  },
  {
    name: 'Diving Uppercut',
    cost: [D, C],
    damage: 120,
    text: 'During your opponent\'s next turn, this Pokémon takes 50 more damage from attacks (after applying Weakness and Resistance).'
  }];

  public regulationMark: string = 'F';
  public set: string = 'SIT';
  public setNumber: string = '110';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Toxicroak';
  public fullName: string = 'Toxicroak SIT 110';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Diving Uppercut — self takes more damage (negative damageReductionNextTurn)
    // Ref: set-crimson-invasion/kommo-o.ts (Clanging Scales)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.damageReductionNextTurn = -50;
    }

    return state;
  }
}
