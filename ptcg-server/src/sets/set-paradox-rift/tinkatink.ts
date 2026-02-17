import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Tinkatink extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Boundless Power',
    cost: [P],
    damage: 40,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark: string = 'G';
  public set: string = 'PAR';
  public setNumber = '83';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Tinkatink';
  public fullName: string = 'Tinkatink PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Boundless Power
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Legacy implementation:
      // - Set player.active.cannotAttackNextTurnPending = true directly.
      //
      // Converted to prefab version (THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN).
      THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN(player);
    }
    
    return state;
  }
}
