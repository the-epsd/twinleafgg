import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Bronzor extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Mirror Attack',
    cost: [M],
    damage: 10,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon is a [M] Pokémon, this attack does 30 more damage.',
  }];

  public set: string = 'M5';
  public setNumber: string = '61';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bronzor';
  public fullName: string = 'Bronzor M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponentActive = effect.opponent.active;
      const ctype = new CheckPokemonTypeEffect(opponentActive);
      store.reduceEffect(state, ctype);
      if (ctype.cardTypes.includes(CardType.METAL)) {
        effect.damage += 30;
      }
    }
    return state;
  }
}
