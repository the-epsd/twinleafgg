import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS } from '../../game/store/prefabs/attack-effects';

export class Gabite2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Gible';
  public cardType: CardType = N;
  public hp: number = 80;
  public weakness = [{ type: N }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Tackle',
      cost: [C],
      damage: 20,
      text: ''
    },
    {
      name: 'Shred',
      cost: [W, F],
      damage: 40,
      text: 'This attack\'s damage isn\'t affected by any effects on the Defending Pokémon.'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '88';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gabite';
  public fullName: string = 'Gabite DRX 88';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-plasma-blast/druddigon.ts (Shred)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 40);
    }

    return state;
  }
}
