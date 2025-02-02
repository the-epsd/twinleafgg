import { PokemonCard, Stage, CardType, StoreLike, State, SpecialCondition } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Fuecoco extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 80;
  public weakness = [{ type: CardType.WATER }];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Heat Burn',
    cost: [CardType.FIRE, CardType.COLORLESS],
    damage: 20,
    text: 'Your opponent\'s Active Pokémon is now Burned.'
  }];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '29';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Fuecoco';
  public fullName: string = 'Fuecoco SV8';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}
