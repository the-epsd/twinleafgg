import { CardTag, CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AFTER_ATTACK } from '../../game/store/prefabs/prefabs';

export class Wailordex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Wailmer';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = W;
  public hp: number = 380;
  public weakness = [{ type: L }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Surf',
    cost: [W, W, W],
    damage: 120,
    text: '',
  },
  {
    name: 'Falling Down',
    cost: [W, W, W, W, W],
    damage: 270,
    text: 'This Pokémon is now Asleep.',
  }];

  public set: string = 'M5';
  public setNumber: string = '15';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Wailord ex';
  public fullName: string = 'Wailord ex M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-ultra-prism/roserade.ts (Inviting Poison — AfterAttack + direct special condition)
    if (AFTER_ATTACK(effect, 1, this)) {
      effect.player.active.addSpecialCondition(SpecialCondition.ASLEEP);
    }

    return state;
  }
}
