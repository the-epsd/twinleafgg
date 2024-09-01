import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Aron extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'H';

  public cardType: CardType = CardType.METAL;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public hp: number = 70;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Double-Edge',
      cost: [CardType.METAL],
      damage: 20,
      text: 'This Pokémon also does 10 damage to itself.'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '120';

  public name: string = 'Aron';

  public fullName: string = 'Aron TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 10);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    return state;
  }

}