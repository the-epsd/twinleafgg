import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Scyther extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Cut Up',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Slashing Strike',
    cost: [C, C],
    damage: 60,
    text: 'During your next turn, this Pokémon can\'t use Slashing Strike.'
  }];

  public regulationMark: string = 'H';
  public set: string = 'TEF';
  public name: string = 'Scyther';
  public fullName: string = 'Scyther TEF';
  public setNumber: string = '1';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Slashing Strike
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // Legacy implementation:
      // - Pushed "Slashing Strike" into cannotUseAttacksNextTurnPending if missing.
      //
      // Converted to prefab version (THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN).
      THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN(player, this.attacks[1]);
    }
    return state;
  }
}
