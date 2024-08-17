import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { AfterDamageEffect, ApplyWeaknessEffect } from '../../game/store/effects/attack-effects';

export class WalkingWakeex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.ANCIENT];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 220;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Azure Wave',
    powerType: PowerType.ABILITY,
    text: 'Damage from attacks used by this Pokémon isn\'t affected by any effects on your opponent\'s Active Pokémon.'
  }];

  public attacks = [
    {
      name: 'Cathartic Roar',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 120,
      text: 'If your opponent\'s Active Pokémon is affected by a Special Condition, this attack does 120 more damage.'
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '50';

  public name: string = 'Walking Wake ex';

  public fullName: string = 'Walking Wake ex TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect) {

      const player = effect.player;

      const targetCard = player.active.getPokemonCard();
      if (targetCard && targetCard.name == 'Walking Wake ex') {

        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return state;
        }

        const opponent = StateUtils.getOpponent(state, player);

        const applyWeakness = new ApplyWeaknessEffect(effect, effect.damage);
        store.reduceEffect(state, applyWeakness);
        const damage = applyWeakness.damage;

        effect.damage = 0;

        if (damage > 0) {
          opponent.active.damage += damage;
          const afterDamage = new AfterDamageEffect(effect, damage);
          state = store.reduceEffect(state, afterDamage);
        }
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.active.specialConditions.length > 0) {
        const attackEffect = effect as AttackEffect;
        attackEffect.damage += 120;
      }
      return state;
    }
    return state;
  }
}
