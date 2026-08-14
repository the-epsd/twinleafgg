import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class AlolanSandslash extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Alolan Sandshrew';
  public cardType: CardType = M;
  public hp: number = 120;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Curve Strike',
    cost: [],
    damage: 30,
    text: 'Flip a coin. If heads, prevent all damage done to this Pokémon by attacks during your opponent\'s next turn.'
  }, {
    name: 'Reinforced Needle',
    cost: [M, C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'If this Pokémon has a Pokémon Tool card attached to it, this attack does 60 more damage.'
  }];

  public set: string = 'CEC';
  public setNumber: string = '138';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Alolan Sandslash';
  public fullName: string = 'Alolan Sandslash CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Curve Strike
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
        }
      });
    }

    // Reinforced Needle
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.player.active.tools.length > 0) {
        effect.damage += 60;
      }
    }

    return state;
  }
}
