import { Attack, CardType, GamePhase, PokemonCard, PokemonCardList, Stage, State, StateUtils, StoreLike } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN, HAS_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Aggron extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Lairon';
  public cardType: CardType = M;
  public hp: number = 180;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C, C];

  public attacks: Attack[] = [{
    name: 'Counter Press',
    cost: [M, C, C],
    damage: 90,
    text: 'During your opponent\'s next turn, if this Pokémon is damaged by an attack (even if this Pokémon is Knocked Out), put damage counters on the Attacking Pokémon equal to the damage done to this Pokémon.'
  },
  {
    name: 'Heavy Impact',
    cost: [M, M, C, C],
    damage: 180,
    text: ''
  }];

  public set: string = 'CRZ';
  public regulationMark: string = 'F';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';
  public name: string = 'Aggron';
  public fullName: string = 'Aggron CRZ';

  public readonly COUNTER_PRESS_MARKER = 'COUNTER_PRESS_MARKER';
  public readonly CLEAR_COUNTER_PRESS_MARKER = 'CLEAR_COUNTER_PRESS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      ADD_MARKER(this.COUNTER_PRESS_MARKER, cardList, this);
      ADD_MARKER(this.CLEAR_COUNTER_PRESS_MARKER, opponent, this);
    }

    if ((effect instanceof PutDamageEffect) && HAS_MARKER(this.COUNTER_PRESS_MARKER, effect.target, this) && state.phase === GamePhase.ATTACK) {
      effect.source.damage += effect.damage;
    }

    CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state, effect, this.CLEAR_COUNTER_PRESS_MARKER, this.COUNTER_PRESS_MARKER, this);

    return state;
  }
}