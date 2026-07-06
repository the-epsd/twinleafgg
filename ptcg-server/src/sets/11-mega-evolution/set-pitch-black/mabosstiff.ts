import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { GamePhase, PlayerType, StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Mabosstiff extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Maschiff';
  public cardType: CardType = D;
  public hp: number = 140;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Bite',
    cost: [D, D],
    damage: 60,
    text: '',
  },
  {
    name: 'Diving Headbutt',
    cost: [D, D, D],
    damage: 210,
    text: 'During your opponent\'s next turn, this Pokémon takes 100 extra damage from attacks from your opponent\'s Pokémon.',
  }];

  public set: string = 'M5';
  public setNumber: string = '56';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mabosstiff';
  public fullName: string = 'Mabosstiff M5';

  public readonly DIVING_DEBUFF_MARKER = 'M5_MABOSTIFF_DIVING';
  public readonly CLEAR_DIVING_MARKER = 'M5_MABOSTIFF_CLEAR_DIVING';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.active.marker.addMarker(this.DIVING_DEBUFF_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_DIVING_MARKER, this);
    }

    if ((effect instanceof DealDamageEffect || effect instanceof PutDamageEffect)
      && state.phase === GamePhase.ATTACK
      && effect.target.marker.hasMarker(this.DIVING_DEBUFF_MARKER, this)) {
      const defenderOwner = StateUtils.findOwner(state, effect.target);
      if (effect.player !== defenderOwner) {
        effect.damage += 100;
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_DIVING_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_DIVING_MARKER, this);
      const opp = StateUtils.getOpponent(state, effect.player);
      opp.forEachPokemon(PlayerType.TOP_PLAYER, cardList =>
        cardList.marker.removeMarker(this.DIVING_DEBUFF_MARKER, this)
      );
    }

    return state;
  }
}
