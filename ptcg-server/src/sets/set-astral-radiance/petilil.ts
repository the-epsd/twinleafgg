import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

export class Petilil extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 50;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Spin Turn',
    cost: [G],
    damage: 10,
    text: 'Switch this Pokémon with 1 of your Benched Pokémon.',
  }];

  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '15';
  public name: string = 'Petilil';
  public fullName: string = 'Petilil ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
    }

    return state;
  }
}