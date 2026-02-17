import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, ADD_MARKER, ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT, CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';

export class Sableye extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 80;
  public retreat = [C];

  public readonly MIRROR_GEM_MARKER = 'SABLEYE_UNM_MIRROR_GEM_MARKER';
  public readonly CLEAR_MIRROR_GEM_MARKER = 'SABLEYE_UNM_CLEAR_MIRROR_GEM_MARKER';

  public attacks = [
    {
      name: 'Mirror Gem',
      cost: [D],
      damage: 10,
      text: 'During your opponent\'s next turn, if this Pokémon is damaged by an attack (even if it is Knocked Out), put 8 damage counters on the Attacking Pokémon.'
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '133';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sableye';
  public fullName: string = 'Sableye UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Mirror Gem
    // Ref: set-unbroken-bonds/aggron.ts (Extra-Tight Press - retaliation damage)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      ADD_MARKER(this.MIRROR_GEM_MARKER, player.active, this);
      ADD_MARKER(this.CLEAR_MIRROR_GEM_MARKER, opponent, this);
    }

    // Retaliate when damaged
    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: this })) {
      if (effect.target.marker.hasMarker(this.MIRROR_GEM_MARKER, this)) {
        const damageEffect = new PutCountersEffect(effect, 80);
        damageEffect.target = effect.source;
        store.reduceEffect(state, damageEffect);
      }
    }

    CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state, effect, this.CLEAR_MIRROR_GEM_MARKER, this.MIRROR_GEM_MARKER, this);

    return state;
  }
}
