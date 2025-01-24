import { CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class WeedleTEU extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 50;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public set = 'TEU';

  public setNumber = '3';

  public cardImage = 'assets/cardback.png';

  public name = 'Weedle';

  public fullName = 'Weedle TEU';

  public attacks = [
    {
      name: 'Reckless Charge',
      cost: [CardType.COLORLESS],
      damage: 20,
      text: 'This Pokemon does 10 damage to itself.'
    },
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Reckless Charge
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 10);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    return state;
  }
}