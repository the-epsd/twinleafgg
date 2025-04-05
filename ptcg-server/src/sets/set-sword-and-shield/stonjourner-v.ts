import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { ADD_MARKER, HAS_MARKER, CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';

export class StonjournerV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_V];
  public cardType: CardType = F;
  public hp: number = 220;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Guard Press',
      cost: [F],
      damage: 40,
      text: 'During your opponent\'s next turn, this Pokémon takes 20 less damage from attacks (after applying Weakness and Resistance).'
    },
    {
      name: 'Mega Kick',
      cost: [F, F, F],
      damage: 150,
      text: ''
    },
  ];

  public set: string = 'SSH';
  public regulationMark = 'D';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '115';
  public name: string = 'Stonjourner V';
  public fullName: string = 'Stonjourner V SSH';

  public readonly GUARD_PRESS_MARKER = 'GUARD_PRESS_MARKER';
  public readonly CLEAR_GUARD_PRESS_MARKER = 'CLEAR_GUARD_PRESS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_MARKER(this.GUARD_PRESS_MARKER, player.active, this);
      ADD_MARKER(this.CLEAR_GUARD_PRESS_MARKER, opponent, this);
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      if (HAS_MARKER(this.GUARD_PRESS_MARKER, effect.target, this)) {
        effect.damage -= 20;
      }
    }

    CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(
      state,
      effect,
      this.CLEAR_GUARD_PRESS_MARKER,
      this.GUARD_PRESS_MARKER,
      this
    );

    return state;
  }
}
