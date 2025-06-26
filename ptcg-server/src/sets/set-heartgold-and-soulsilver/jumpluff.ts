import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {
  StoreLike, State, StateUtils,
  PlayerType,
  GamePhase
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ADD_MARKER, HAS_MARKER, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Jumpluff extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Skiploom';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Mass Attack',
    cost: [G],
    damage: 10,
    damageCalculation: 'x',
    text: 'Does 10 damage times the number of Pokémon in play (both yours and your opponent\'s).'
  },
  {
    name: 'Leaf Guard',
    cost: [G],
    damage: 30,
    text: 'During your opponent\'s next turn, any damage done to Jumpluff by attacks is reduced by 30 (after applying Weakness and Resistance).'
  }];

  public set: string = 'HS';
  public name: string = 'Jumpluff';
  public fullName: string = 'Jumpluff HS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';

  public readonly LEAF_GUARD_MARKER = 'LEAF_GUARD_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      let pokemonInPlay = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, () => { pokemonInPlay += 1; });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, () => { pokemonInPlay += 1; });
      effect.damage = 10 * pokemonInPlay;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      ADD_MARKER(this.LEAF_GUARD_MARKER, effect.player, this);
    }

    if (effect instanceof PutDamageEffect
      && HAS_MARKER(this.LEAF_GUARD_MARKER, StateUtils.getOpponent(state, effect.player), this)
      && effect.target.getPokemonCard() === this) {

      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      effect.damage -= 30;
    }

    if (effect instanceof EndTurnEffect && effect.player !== StateUtils.findOwner(state, StateUtils.findCardList(state, this))) {
      REMOVE_MARKER(this.LEAF_GUARD_MARKER, StateUtils.getOpponent(state, effect.player), this);
    }

    return state;
  }

}
