import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Lairon extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Aron';

  public regulationMark = 'H';

  public cardType: CardType = CardType.METAL;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public hp: number = 110;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Steel Tackle',
      cost: [CardType.METAL],
      damage: 40,
      text: 'This Pokémon also does 20 damage to itself.'
    },
    {
      name: 'Metal Claw',
      cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      text: ''
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '121';

  public name: string = 'Lairon';

  public fullName: string = 'Lairon TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 20);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    return state;
  }

}