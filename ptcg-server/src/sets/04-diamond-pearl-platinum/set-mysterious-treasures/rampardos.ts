import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AfterDamageEffect } from '../../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import { THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Rampardos extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Cranidos';
  public hp: number = 120;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G, value: +30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Assurance',
    cost: [F, C],
    damage: 30,
    text: 'As long as the Defending Pokémon\'s remaining HP is 60 or less, this attack\'s base damage is 60 instead of 30.'
  },
  {
    name: 'Hasty Headbutt',
    cost: [F, F, F],
    damage: 100,
    text: 'Rampardos does 20 damage to itself. This attack\'s damage isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other effects on the Defending Pokémon.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Rampardos';
  public fullName: string = 'Rampardos MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Assurance
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const checkHp = new CheckHpEffect(opponent, opponent.active);
      store.reduceEffect(state, checkHp);
      const remainingHp = checkHp.hp - opponent.active.damage;
      if (remainingHp <= 60) {
        effect.damage = 60;
      }
    }

    // Hasty Headbutt
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 20);
      const damage = effect.damage;
      effect.damage = 0;
      if (damage > 0) {
        opponent.active.damage += damage;
        store.reduceEffect(state, new AfterDamageEffect(effect, damage));
      }
    }

    return state;
  }
}
