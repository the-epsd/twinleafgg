import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Breloom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Shroomish';
  public cardType: CardType = G;
  public hp: number = 110;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Spore Ball',
      cost: [G],
      damage: 30,
      text: 'Your opponent\'s Active Pokémon is now Asleep.',
    },
    {
      name: 'Powdery Uppercut',
      cost: [G],
      damage: 130,
      text: 'You can use this attack only if this Pokémon used Spore Ball during your last turn.',
    }
  ];

  public set: string = 'BRS';
  public regulationMark = 'F';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';

  public name: string = 'Breloom';
  public fullName: string = 'Breloom BRS';

  public sporeBallTurn = -10;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      this.sporeBallTurn = state.turn;
      store.reduceEffect(state, specialConditionEffect);
    }
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1] && state.turn !== this.sporeBallTurn + 2) {
      throw new GameError(GameMessage.CANNOT_USE_ATTACK);
    }
    return state;
  }

}