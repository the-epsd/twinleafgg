import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';

export class Wailmer extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp: number = 120;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public evolvesInto = 'Wailord';

  public attacks = [{
    name: 'Nap',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Heal 30 damage from this Pokémon.'
  },
  {
    name: 'Water Gun',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 70,
    text: ''
  }
  ];

  public set: string = 'CRZ';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '31';

  public name: string = 'Wailmer';

  public fullName: string = 'Wailmer CRZ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const target = player.active;
      const healEffect = new HealEffect(player, target, 30);
      state = store.reduceEffect(state, healEffect);
      return state;
    }

    return state;
  }
}
