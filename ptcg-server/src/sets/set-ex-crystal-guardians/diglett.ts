import { Attack, CardType, PokemonCard, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { ADD_MARKER, BLOCK_RETREAT_IF_MARKER } from '../../game/store/prefabs/prefabs';

export class Diglett extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 50;
  public weakness: Weakness[] = [{ type: G }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    {
      name: 'Mud Slap',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Sand Pit',
      cost: [F, C],
      damage: 20,
      text: "The Defending Pokémon can't retreat during your opponent's next turn."
    },
  ];

  public set: string = 'CG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '50';
  public name: string = 'Diglett';
  public fullName: string = 'Diglett CG';

  public readonly SAND_PIT_MARKER: string = 'SAND_PIT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_MARKER(this.SAND_PIT_MARKER, opponent.active, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, this.SAND_PIT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, this.SAND_PIT_MARKER, this);

    return state;
  }
}
