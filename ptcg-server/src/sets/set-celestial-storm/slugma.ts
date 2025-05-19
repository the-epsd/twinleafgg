import { PokemonCard, Stage, State, StoreLike, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Slugma extends PokemonCard {

  public stage = Stage.BASIC;
  public cardType = R;
  public hp = 70;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Magma Ring',
      cost: [C],
      damage: 10,
      text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
    },
    {
      name: 'Flare',
      cost: [R, C],
      damage: 20,
      text: ''
    },
  ];

  public set: string = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Slugma';
  public fullName: string = 'Slugma CES';

  public readonly MAGMA_RING_MARKER: string = 'MAGMA_RING_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_MARKER(this.MAGMA_RING_MARKER, opponent.active, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, this.MAGMA_RING_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, this.MAGMA_RING_MARKER, this);

    return state;
  }
}