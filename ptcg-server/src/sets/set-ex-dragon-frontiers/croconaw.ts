import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { StoreLike, State } from '../../game';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, COIN_FLIP_PROMPT, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { MarkerConstants } from '../../game/store/markers/marker-constants';

export class Croconaw extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Totodile';
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Scary Face',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon can\'t attack or retreat during your opponent\'s next turn.'
  },
  {
    name: 'Slash',
    cost: [L, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'DF';
  public name: string = 'Croconaw';
  public fullName: string = 'Croconaw DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          BLOCK_RETREAT(store, state, effect, this);
        }
      });
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    return state;
  }

} 