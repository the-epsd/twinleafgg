import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, THIS_ATTACK_DOES_X_MORE_DAMAGE, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Voltorb extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 40;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Magnetic Bomb',
    cost: [L],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 20 damage plus 10 more damage. If tails, Voltorb does 10 damage to itself.'
  }];

  public set: string = 'TM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '83';
  public name: string = 'Voltorb';
  public fullName: string = 'Voltorb TM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 10);
        } else {
          THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
        }
      });
    }

    return state;
  }
}