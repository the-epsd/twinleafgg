import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { StoreLike, State, PlayerType, StateUtils, GamePhase } from '../../game';
import { PutCountersEffect, AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MegaSlowbroex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Slowpoke';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = P;
  public hp: number = 330;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Shellnado Spin',
    cost: [P, P, P],
    damage: 180,
    text: 'During your opponent\'s next turn, if this Pokemon takes damage from an attack, put 12 damage counters on the Attacking Pokemon.'
  }];

  public regulationMark = 'I';
  public set: string = 'MEP';
  public setNumber = '71';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Slowbro ex';
  public fullName: string = 'Mega Slowbro ex MEP';

  public readonly SHELLNADO_SPIN_MARKER = 'SHELLNADO_SPIN_MARKER';
  public readonly CLEAR_SHELLNADO_SPIN_MARKER = 'CLEAR_SHELLNADO_SPIN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Shellnado Spin - add marker when attack is used
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.active.marker.addMarker(this.SHELLNADO_SPIN_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_SHELLNADO_SPIN_MARKER, this);
    }

    // Shellnado Spin - counter-damage during opponent's next turn
    if (effect instanceof AfterDamageEffect && effect.target.cards.includes(this)) {
      const targetCard = effect.target.getPokemonCard();
      if (targetCard === this && effect.target.marker.hasMarker(this.SHELLNADO_SPIN_MARKER, this)) {
        // Check if damage is from an attack
        if (effect.attackEffect && state.phase === GamePhase.ATTACK) {
          const attackingPokemon = effect.source;
          if (attackingPokemon) {
            // Put 12 damage counters (120 damage) on the Attacking Pokemon
            const putCountersEffect = new PutCountersEffect(effect.attackEffect, 120);
            putCountersEffect.target = attackingPokemon;
            store.reduceEffect(state, putCountersEffect);
          }
        }
      }
    }

    // Clear marker at end of opponent's turn
    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_SHELLNADO_SPIN_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_SHELLNADO_SPIN_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.SHELLNADO_SPIN_MARKER, this);
      });
    }

    return state;
  }
}
