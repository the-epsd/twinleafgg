import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Exeggcute extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 50;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Hypnosis',
    cost: [CardType.PSYCHIC],
    damage: 0,
    text: 'The Defending Pokémon is now Asleep.'
  },
  {
    name: 'Leech Seed',
    cost: [CardType.GRASS, CardType.GRASS],
    damage: 20,
    text: 'Unless all damage from this attack is prevented, you may remove 1 damage counter from Exeggcute.'
  }];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '52';

  public name: string = 'Exeggcute';

  public fullName: string = 'Exeggcute JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const target = player.active;

      const damageEffect = new DealDamageEffect(effect, 40);
      damageEffect.target = effect.target;

      state = store.reduceEffect(state, damageEffect);

      if (damageEffect.damage > 0) {
        const healEffect = new HealEffect(player, target, 10);
        state = store.reduceEffect(state, healEffect);
      }

      return state;
    }

    return state;
  }
}