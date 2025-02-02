import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { ApplyWeaknessEffect, AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';


export class Staryu extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 60;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Swift',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: 30,
      text: 'This attack\'s damage isn\'t affected by Weakness or Resistance, or by any effects on your opponent\'s Active Pokémon.'
    },
  ];

  public regulationMark = 'G';

  public set: string = 'MEW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '120';

  public name: string = 'Staryu';

  public fullName: string = 'Staryu MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const applyWeakness = new ApplyWeaknessEffect(effect, 30);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }
    return state;
  }
}
