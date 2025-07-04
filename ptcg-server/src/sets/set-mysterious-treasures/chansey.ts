import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN, COIN_FLIP_PROMPT, PREVENT_DAMAGE_IF_TARGET_HAS_MARKER, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Chansey extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 100;
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Scrunch',
    cost: [C, C],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all damage done to Chansey by attacks during your opponent\'s next turn.'
  },
  {
    name: 'Double-edge',
    cost: [C, C, C, C],
    damage: 80,
    text: 'Chansey does 60 damage to itself.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '76';
  public name: string = 'Chansey';
  public fullName: string = 'Chansey MT';

  public readonly CLEAR_SHELL_HIT_MARKER = 'CLEAR_SHELL_HIT_MARKER';
  public readonly SHELL_HIT_MARKER = 'SHELL_HIT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result)
          return;
        ADD_MARKER(this.SHELL_HIT_MARKER, player.active, this);
        ADD_MARKER(this.CLEAR_SHELL_HIT_MARKER, opponent, this);
      });
    }

    PREVENT_DAMAGE_IF_TARGET_HAS_MARKER(effect, this.SHELL_HIT_MARKER, this);
    CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state, effect, this.CLEAR_SHELL_HIT_MARKER, this.SHELL_HIT_MARKER, this);

    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 60);
    }

    return state;
  }
}