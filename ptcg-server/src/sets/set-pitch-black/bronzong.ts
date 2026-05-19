import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GamePhase, PlayerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Bronzong extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Bronzor';
  public cardType: CardType = M;
  public hp: number = 130;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Gentle Slap',
    cost: [M],
    damage: 40,
    text: '',
  },
  {
    name: 'Metal Block',
    cost: [M, M, C],
    damage: 120,
    text: 'During your opponent\'s next turn, this Pokémon takes 100 less damage from attacks from your opponent\'s Evolution Pokémon.',
  }];

  public set: string = 'M5';
  public setNumber: string = '62';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bronzong';
  public fullName: string = 'Bronzong M5';

  public readonly METAL_BLOCK_MARKER = 'M5_BRONZONG_METALBLOCK';
  public readonly CLEAR_METAL_BLOCK_MARKER = 'M5_BRONZONG_CLEAR_METALBLOCK';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opp = StateUtils.getOpponent(state, player);

      player.active.marker.addMarker(this.METAL_BLOCK_MARKER, this);
      opp.marker.addMarker(this.CLEAR_METAL_BLOCK_MARKER, this);
    }

    if ((effect instanceof DealDamageEffect || effect instanceof PutDamageEffect)
      && state.phase === GamePhase.ATTACK
      && effect.target.marker.hasMarker(this.METAL_BLOCK_MARKER, this)) {
      const defenderOwner = StateUtils.findOwner(state, effect.target);
      if (effect.player === defenderOwner) {
        return state;
      }
      const source = effect.source.getPokemonCard();
      if (source && source.stage !== Stage.BASIC && effect.damage > 0) {
        effect.damage = Math.max(0, effect.damage - 100);
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_METAL_BLOCK_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_METAL_BLOCK_MARKER, this);
      const opp = StateUtils.getOpponent(state, effect.player);
      opp.forEachPokemon(PlayerType.TOP_PLAYER, cardList =>
        cardList.marker.removeMarker(this.METAL_BLOCK_MARKER, this)
      );
    }

    return state;
  }
}
