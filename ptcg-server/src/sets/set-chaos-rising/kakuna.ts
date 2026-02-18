import { CardType, Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Kakuna extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Weedle';
  public hp: number = 80;
  public cardType: CardType = G;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Exoskeleton',
    powerType: PowerType.ABILITY,
    text: 'This Pokemon takes 20 less damage from attacks.'
  }];

  public attacks = [{
    name: 'Hang Down',
    cost: [G],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name: string = 'Kakuna';
  public fullName: string = 'Kakuna M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)) {
      const targetPlayer = StateUtils.findOwner(state, effect.target);
      if (IS_ABILITY_BLOCKED(store, state, targetPlayer, this)) {
        return state;
      }
      if (effect.target.getPokemonCard() === this) {
        effect.damage = Math.max(0, effect.damage - 20);
      }
    }
    return state;
  }
}
