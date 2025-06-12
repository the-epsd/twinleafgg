import { Attack, CardType, PokemonCard, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { ADD_MARKER, BLOCK_RETREAT_IF_MARKER } from '../../game/store/prefabs/prefabs';

export class Sneasel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 60;
  public weakness: Weakness[] = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [{
    name: 'Corner',
    cost: [D],
    damage: 10,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  },
  {
    name: 'Scratch',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'NXD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Sneasel';
  public fullName: string = 'Sneasel NXD';

  public readonly CORNER_MARKER: string = 'CORNER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_MARKER(this.CORNER_MARKER, opponent.active, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, this.CORNER_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, this.CORNER_MARKER, this);

    return state;
  }
}
