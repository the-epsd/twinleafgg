import { StoreLike, State, StateUtils } from '../../game';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Butterfree extends PokemonCard {

  public regulationMark = 'D';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Metapod';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 140;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Panic Poison',
      cost: [CardType.GRASS],
      damage: 30,
      text: 'Your opponent\'s Active Pokémon is now Burned, Confused, and Poisoned.'
    },
    {
      name: 'Cutting Wind',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 80,
      text: ''
    },
  ];

  public set: string = 'RCL';

  public name: string = 'Butterfree';

  public fullName: string = 'Butterfree RCL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const active = opponent.active;
      active.addSpecialCondition(SpecialCondition.BURNED);
      active.addSpecialCondition(SpecialCondition.CONFUSED);
      active.addSpecialCondition(SpecialCondition.POISONED);
    }
    return state;
  }
}