import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect, AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { SpecialCondition } from '../../game/store/card/card-types';

export class Misdreavus extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 70;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Hypnoblast',
    cost: [CardType.PSYCHIC, CardType.COLORLESS],
    damage: 10,
    text: 'Your opponent\'s Active Pokémon is now Asleep.'
  }];

  public regulationMark: string = 'G';
  public set: string = 'PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';
  public name: string = 'Misdreavus';
  public fullName: string = 'Misdreavus PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      state = store.reduceEffect(state, specialCondition);
    }
    return state;
  }
}
