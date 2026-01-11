import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Electabuzz extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Haymaker',
    cost: [L],
    damage: 30,
    text: 'During your next turn, this Pokémon can\'t use Haymaker.'
  }];

  public set: string = 'BST';
  public regulationMark = 'F';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Electabuzz';
  public fullName: string = 'Electabuzz BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Haymaker')) {
        player.active.cannotUseAttacksNextTurnPending.push('Haymaker');
      }
    }
    return state;
  }
}
