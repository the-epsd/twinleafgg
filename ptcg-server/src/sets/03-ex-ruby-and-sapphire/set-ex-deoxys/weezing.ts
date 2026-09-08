import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Weezing extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Koffing';
  public cardType: CardType[] = [G];
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Liability',
    cost: [C],
    damage: 0,
    text: 'Put damage counters on the Defending Pokémon until it is 10 HP away from being Knocked Out. Weezing does 70 damage to itself.'
  },
  {
    name: 'Smogscreen',
    cost: [G, C],
    damage: 20,
    text: 'The Defending Pokémon is now Poisoned. If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
  }];

  public set: string = 'DX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';
  public name: string = 'Weezing';
  public fullName: string = 'Weezing DX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const selectedTarget = opponent.active;
      const checkHpEffect = new CheckHpEffect(effect.player, selectedTarget);
      store.reduceEffect(state, checkHpEffect);

      const totalHp = checkHpEffect.hp;
      let damageAmount = totalHp - 10;

      const targetDamage = selectedTarget.damage;
      if (targetDamage > 0) {
        damageAmount = Math.max(0, damageAmount - targetDamage);
      }

      if (damageAmount > 0) {
        const damageEffect = new PutCountersEffect(effect, damageAmount);
        damageEffect.target = selectedTarget;
        store.reduceEffect(state, damageEffect);
      } else if (damageAmount <= 0) {
        const damageEffect = new PutCountersEffect(effect, 0);
        damageEffect.target = selectedTarget;
        store.reduceEffect(state, damageEffect);
      }

      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 70);
    }

    // Ref: DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK (Smokescreen)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      state = DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK(store, state, effect, this);
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
