import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Terapagosex extends PokemonCard {
  public regulationMark = 'H';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Coated Attack',
    cost: [G],
    damage: 20,
    text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Basic Pokémon.'
  }];

  public set: string = 'SCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name: string = 'Dipplin';
  public fullName: string = 'Dipplin SCR';

  public readonly PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER: string = 'PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';
  public readonly CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER: string = 'CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
      return state;
    }

    if (effect instanceof PutDamageEffect
      && effect.target.marker.hasMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER)) {
      const card = effect.source.getPokemonCard();
      const stage = card !== undefined ? card.stage : undefined;

      if (stage === Stage.BASIC) {
        effect.preventDefault = true;
      }

      return state;
    }

    if (effect instanceof EndTurnEffect) {

      if (effect.player.marker.hasMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this)) {
        effect.player.marker.removeMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.marker.removeMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
        });
      }
    }
    return state;
  }
}