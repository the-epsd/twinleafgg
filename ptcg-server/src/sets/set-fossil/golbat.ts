import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Golbat extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 60;
  public weakness = [{ type: CardType.PSYCHIC }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public evolvesFrom = 'Zubat';

  public attacks = [{
    name: 'Wing Attack',
    cost: [C, C, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Leech Life',
    cost: [G, G, C],
    damage: 20,
    text: 'Remove a number of damage counters from Golbat equal to the damage done to the Defending Pokémon (after applying Weakness and Resistance). If Golbat has fewer damage counters than that, remove all of them.'
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';
  public name: string = 'Golbat';
  public fullName: string = 'Golbat FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const target = player.active;

      const damageEffect = new DealDamageEffect(effect, 20);
      damageEffect.target = effect.target;

      state = store.reduceEffect(state, damageEffect);


      const damageToHeal = damageEffect.damage;

      // Heal damage
      const healEffect = new HealEffect(player, target, damageToHeal);
      state = store.reduceEffect(state, healEffect);
      return state;
    }

    return state;
  }
}