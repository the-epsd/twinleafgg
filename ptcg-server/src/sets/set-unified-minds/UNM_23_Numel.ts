import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';

export class Numel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 90;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Tackle',
    cost: [CardType.COLORLESS],
    damage: 10,
    text: ''
  },
  {
    name: 'Flamethrower',
    cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 80,
    text: 'Discard an Energy from this Pokémon.'
  }];

  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Numel';
  public fullName: string = 'Numel UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.COLORLESS, 1)
    }

    return state;
  }
}