import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Skarmory extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 120;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Metal Arms',
    cost: [M],
    damage: 10,
    damageCalculation: '+',
    text: 'If this Pokémon has a Pokémon Tool attached, this attack does 40 more damage.'
  },
  {
    name: 'Cutting Wind',
    cost: [M, C, C],
    damage: 80,
    text: ''
  }];

  public set: string = 'DAA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '120';
  public name: string = 'Skarmory';
  public fullName: string = 'Skarmory DAA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.player.active.tools.length > 0) {
        effect.damage += 40;
      }
    }

    return state;
  }
}