import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { UseAttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ADD_MARKER, BLOCK_RETREAT_IF_MARKER, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class DarkCroconaw extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Totodile';
  public tags = [CardTag.DARK];
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Clamping Jaw',
    cost: [W, W],
    damage: 20,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn. If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing. (Benching either Pokémon ends this effect.)'
  }];

  public set: string = 'N4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  public name: string = 'Dark Croconaw';
  public fullName: string = 'Dark Croconaw N4';

  public readonly DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER';
  public readonly SMOKESCREEN_MARKER = 'SMOKESCREEN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, opponent.active, this);
    }

    if (effect instanceof UseAttackEffect && HAS_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, effect.player.active, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (HAS_MARKER(this.SMOKESCREEN_MARKER, opponent, this)) {
        return state; // Avoids recursion
      }

      effect.preventDefault = true;
      ADD_MARKER(this.SMOKESCREEN_MARKER, opponent, this); // Avoids recursion

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          const useAttackEffect = new UseAttackEffect(player, effect.attack);
          store.reduceEffect(state, useAttackEffect);
        } else {
          const endTurnEffect = new EndTurnEffect(player);
          store.reduceEffect(state, endTurnEffect);
        }
      });
    }
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SMOKESCREEN_MARKER, this);

    // Might as well just use the same marker for both effects
    BLOCK_RETREAT_IF_MARKER(effect, this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this);

    if (effect instanceof EndTurnEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this)) {
      effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this);
    }

    return state;
  }
}