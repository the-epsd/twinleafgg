import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Kadabra extends PokemonCard {

  public name = 'Kadabra';
  
  public set = 'BS';
  
  public fullName = 'Kadabra BS';
  
  public cardType = CardType.PSYCHIC;
  
  public stage = Stage.STAGE_1;
  
  public evolvesFrom = 'Abra';
  
  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '32';

  public hp = 60;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Recover',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      text: 'Discard 1 {P} Energy attached to Kadabra in order to use this attack. Remove all damage counters from Kadabra.',
      damage: 0
    },
    {
      name: 'Super Psy',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: 50,
      text: ''
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.PSYCHIC, 1);

      const player = effect.player;

      const healEffect = new HealEffect(player, player.active, player.active.damage);
      state = store.reduceEffect(state, healEffect);
    }
    
    return state;
  }

}
