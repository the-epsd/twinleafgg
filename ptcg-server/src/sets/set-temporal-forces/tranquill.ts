import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Tranquill extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Pidove';
  public cardType: CardType = C;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public attacks = [{
    name: 'Speed Dive',
    cost: [C],
    damage: 20,
    text: ''
  },
  {
    name: 'Jet Wing',
    cost: [C, C],
    damage: 70,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark: string = 'H';
  public set: string = 'TEF';
  public setNumber = '134';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Tranquill';
  public fullName: string = 'Tranquill TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Jet Wing
    if (WAS_ATTACK_USED(effect, 1, this)) {
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
