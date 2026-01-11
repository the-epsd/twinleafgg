import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Finizen extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Aqua Slash',
    cost: [W],
    damage: 30,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark: string = 'H';
  public set: string = 'TWM';
  public setNumber = '59';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Finizen';
  public fullName: string = 'Finizen TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Aqua Slash
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}