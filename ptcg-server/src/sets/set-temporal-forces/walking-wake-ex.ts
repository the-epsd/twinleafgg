import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { AfterDamageEffect, ApplyWeaknessEffect } from '../../game/store/effects/attack-effects';

export class WalkingWakeex extends PokemonCard {

  public tags = [ CardTag.POKEMON_ex, CardTag.ANCIENT ];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 220;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Azure Wave',
    powerType: PowerType.ABILITY,
    text: 'Damage from attacks used by this Pokémon isn’t affected by any effects on your opponent\'s Active Pokémon.'
  }];

  public attacks = [
    {
      name: 'Cathartic Roar',
      cost: [ CardType.WATER, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 120,
      text: 'During your next turn, this Pokémon can\'t attack.'
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '50';

  public name: string = 'Walking Wake ex';

  public fullName: string = 'Walking Wake ex TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {


    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
              
      const applyWeakness = new ApplyWeaknessEffect(effect, 120);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;
              
      effect.damage = 0;
              
      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }

      if (opponent.active.specialConditions.length > 0) {
        effect.damage += 120;
      }
      return state;
    }
    return state;
  }


}
