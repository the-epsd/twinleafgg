import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, DEVOLVE_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Dialga extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 130;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Turn Back Time',
    cost: [M, C, C],
    damage: 60,
    text: 'If your opponent\'s Active Pokémon is an evolved Pokémon, devolve it by putting the highest Stage Evolution card on it into your opponent\'s hand.'
  },
  {
    name: 'Power Blast',
    cost: [M, M, C, C],
    damage: 130,
    text: 'Discard an Energy from this Pokémon.'
  }];

  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '127';
  public name: string = 'Dialga';
  public fullName: string = 'Dialga LOT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      DEVOLVE_POKEMON(store, state, opponent.active, opponent.hand);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }
}