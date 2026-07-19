import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PlayerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS } from '../../../game/store/prefabs/attack-effects';

export class Manectric extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Electrike';
  public cardType: CardType = L;
  public hp: number = 120;
  public weakness = [{ type: F }];
  public retreat = [C];

  public readonly FLASH_BARRIER_MARKER = 'M5_MANECTRIC_FLASH_BARRIER';
  public readonly CLEAR_FLASH_BARRIER_MARKER = 'M5_MANECTRIC_CLEAR_FLASH';

  public attacks = [
    {
      name: 'Flashing Barrier',
      cost: [L, L],
      damage: 50,
      text: "During your opponent's next turn, prevent all damage done to this Pokémon by attacks from Evolution Pokémon.",
    },
    {
      name: 'Sonic Edge',
      cost: [L, L, L],
      damage: 110,
      shredAttack: true,
      text: "This attack's damage isn't affected by any effects on your opponent's Active Pokémon.",
    },
  ];

  public set: string = 'PBL';
  public setNumber: string = '24';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Manectric';
  public fullName: string = 'Manectric M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-astral-radiance/glaceon.ts (Frost Wall)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.FLASH_BARRIER_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_FLASH_BARRIER_MARKER, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 110);
    }

    if (
      (effect instanceof DealDamageEffect || effect instanceof PutDamageEffect) &&
      effect.target.marker.hasMarker(this.FLASH_BARRIER_MARKER, this)
    ) {
      const atk = effect.source.getPokemonCard();
      if (atk && atk.stage !== Stage.BASIC) {
        effect.preventDefault = true;
      }
    }

    if (
      effect instanceof EndTurnEffect &&
      effect.player.marker.hasMarker(this.CLEAR_FLASH_BARRIER_MARKER, this)
    ) {
      effect.player.marker.removeMarker(this.CLEAR_FLASH_BARRIER_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.FLASH_BARRIER_MARKER, this);
      });
    }

    return state;
  }
}
