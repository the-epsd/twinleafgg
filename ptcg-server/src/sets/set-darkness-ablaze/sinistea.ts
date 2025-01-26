import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';

export class Sinistea extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = P;

  public hp: number = 30;

  public weakness = [{ type: D }];

  public resistance = [{ type: F, value: -30 }];

  public attacks = [{
    name: 'Furtive Drop',
    cost: [C],
    damage: 0,
    text: 'Put 2 damage counters on your opponent\'s Active Pokémon.'
  }];

  public regulationMark = 'D';

  public set: string = 'DAA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '82';

  public name: string = 'Sinistea';

  public fullName: string = 'Sinistea DAA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const attackEffect = effect as AttackEffect;
      const damageEffect = new PutCountersEffect(attackEffect, 70);
      return store.reduceEffect(state, damageEffect);
    }

    return state;
  }

}
