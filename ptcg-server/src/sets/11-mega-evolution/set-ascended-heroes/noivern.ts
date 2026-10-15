import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Noivern extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Noibat';
  public hp: number = 120;
  public cardType: CardType[] = [N];
  public weakness = [];
  public retreat = [];

  public attacks = [{
    name: 'Agility',
    cost: [C, C],
    damage: 40,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
  },
{
    name: 'Enhanced Blade',
    cost: [P, D],
    damage: 70,
    damageCalculation: '+',
    text: 'If this Pokémon has a Pokémon Tool attached, this attack does 70 more damage.'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '157';
  public name: string = 'Noivern';
  public fullName: string = 'Noivern ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Agility
    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this);
    }

    // Enhanced Blade
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.source.tools.length > 0) {
      effect.damage += 80;
      }
    }

    return state;
  }
}
