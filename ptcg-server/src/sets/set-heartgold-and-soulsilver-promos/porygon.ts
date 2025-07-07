import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {
  StoreLike, State, StateUtils,
  PlayerType,
  GamePhase
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ADD_MARKER, HAS_MARKER, REMOVE_MARKER, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Porygon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Stiffen',
    cost: [C],
    damage: 0,
    text: 'During your opponent\'s next turn, any damage done to Porygon by attacks is reduced by 20 (after applying Weakness and Resistance).'
  },
  {
    name: 'Version Update',
    cost: [C, C],
    damage: 0,
    text: 'Search your deck for Porygon2, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  }];

  public set: string = 'HSP';
  public name: string = 'Porygon';
  public fullName: string = 'Porygon HSP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';

  public readonly STIFFEN_MARKER = 'STIFFEN_MARKER';

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
      ADD_MARKER(this.STIFFEN_MARKER, effect.player, this);
    }

    if (effect instanceof PutDamageEffect
      && HAS_MARKER(this.STIFFEN_MARKER, StateUtils.getOpponent(state, effect.player), this)
      && effect.target.getPokemonCard() === this) {

      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      effect.damage -= 20;
    }

    if (effect instanceof EndTurnEffect && effect.player !== StateUtils.findOwner(state, StateUtils.findCardList(state, this))) {
      REMOVE_MARKER(this.STIFFEN_MARKER, StateUtils.getOpponent(state, effect.player), this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, effect.player, { name: 'Porygon2' });
    }

    return state;
  }

}
