import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Ariados extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Spinarak';
  public cardType: CardType[] = [D];
  public hp: number = 100;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Sharp Poison',
    cost: [D],
    damage: 0,
    text: 'Your opponent\'s Active Pokemon is now Poisoned. During Pokemon Checkup, put 4 damage counters on that Pokemon instead of 1.'
  },
  {
    name: 'Covert Needle',
    cost: [C, C, C],
    damage: 80,
    text: 'During your opponent\'s next turn, prevent all damage done to this Pokemon by attacks from Basic Pokemon.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M6';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Ariados';
  public fullName: string = 'Ariados M6';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sharp Poison
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
      effect.opponent.active.poisonDamage = 40;
    }

    // Covert Needle
    if (WAS_ATTACK_USED(effect, 1, this)) {
      PREVENT_DAMAGE(store, state, effect, this, { sourceStage: Stage.BASIC });
    }

    return state;
  }
}