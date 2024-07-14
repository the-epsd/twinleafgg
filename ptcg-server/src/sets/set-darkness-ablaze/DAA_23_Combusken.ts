import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Combusken extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 90;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS];
  public evolvesFrom = 'Torchic';

  public attacks = [{
    name: 'Smash Kick',
    cost: [CardType.FIRE],
    damage: 20,
    text: ''
  },
  {
    name: 'Heat Beak',
    cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
    damage: 40,
    text: 'Your opponent\'s Active Pokémon is now Burned.'
  }];

  public regulationMark = 'D';
  public set = 'DAA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name = 'Combusken';
  public fullName = 'Combusken DAA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }

}