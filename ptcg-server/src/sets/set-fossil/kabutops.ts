import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Kabutops extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Kabuto';
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 60;
  public weakness = [{ type: CardType.GRASS, value: 2 }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    {
      name: 'Sharp Sickle',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: 30,
      text: ''
    },
    {
      name: 'Absorb',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING],
      damage: 40,
      text: 'Remove a number of damage counters from Kabutops equal to half the damage done to the Defending Pokémon (after applying Weakness and Resistance) (rounded up to the nearest 10). If Kabutops has fewer damage counters than that, remove all of them.'
    }
  ];

  public set: string = 'FO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '9';

  public name: string = 'Kabutops';

  public fullName: string = 'Kabutops FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const target = player.active;

      const damageEffect = new DealDamageEffect(effect, 40);
      damageEffect.target = effect.target;

      state = store.reduceEffect(state, damageEffect);


      const damageToHeal = damageEffect.damage / 2;

      // rounding to nearest 10
      const damageToHealLow = (damageToHeal / 10) * 10;
      const damageToHealHigh = damageToHealLow + 10;
      const heal = (damageToHeal - damageToHealLow >= damageToHealHigh - damageToHeal) ? damageToHealHigh : damageToHealLow;

      // Heal damage
      const healEffect = new HealEffect(player, target, heal);
      state = store.reduceEffect(state, healEffect);
      return state;
    }
    return state;
  }
}
