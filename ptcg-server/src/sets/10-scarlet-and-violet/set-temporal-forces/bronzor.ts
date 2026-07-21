import { PokemonCard, State, StoreLike } from '../../../game';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Bronzor extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Mirror Attack',
    cost: [P],
    damage: 10,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon is a [P] Pokémon, this attack does 30 more damage.',
  }];

  public regulationMark = 'H';
  public set: string = 'TEF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';
  public name: string = 'Bronzor';
  public fullName: string = 'Bronzor TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mirror Attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponentActive = effect.opponent.active;
      const checkType = new CheckPokemonTypeEffect(opponentActive);
      store.reduceEffect(state, checkType);
      if (checkType.cardTypes.includes(CardType.PSYCHIC)) {
        effect.damage += 30;
      }
    }

    return state;
  }
}