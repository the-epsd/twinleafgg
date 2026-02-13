import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GamePhase, PlayerType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

export class Reuniclus extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Duosion';
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Barrier Attack',
      cost: [P],
      damage: 30,
      text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 30 (after applying Weakness and Resistance).'
    },
    {
      name: 'Telekinesis of Nobility',
      cost: [P, C, C],
      damage: 70,
      text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '44';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Reuniclus';
  public fullName: string = 'Reuniclus PLB';

  public readonly BARRIER_ATTACK_MARKER = 'BARRIER_ATTACK_MARKER';
  public readonly CLEAR_BARRIER_ATTACK_MARKER = 'CLEAR_BARRIER_ATTACK_MARKER';

  public usedTelekinesis = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Barrier Attack - damage reduction marker
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.BARRIER_ATTACK_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_BARRIER_ATTACK_MARKER, this);
    }

    // Intercept incoming damage for Barrier Attack
    // Ref: set-base-set/pluspower.ts (AfterWeaknessAndResistance timing via post-W/R hook)
    if (effect instanceof PutDamageEffect && effect.target.marker.hasMarker(this.BARRIER_ATTACK_MARKER, this)) {
      const targetOwner = StateUtils.findOwner(state, effect.target);
      if (state.phase === GamePhase.ATTACK && effect.player !== targetOwner) {
        effect.damage = Math.max(0, effect.damage - 30);
      }
    }

    // Cleanup Barrier Attack marker
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_BARRIER_ATTACK_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_BARRIER_ATTACK_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.BARRIER_ATTACK_MARKER, this);
      });
    }

    // Attack 2: Telekinesis of Nobility - switch after damage
    if (WAS_ATTACK_USED(effect, 1, this)) {
      this.usedTelekinesis = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedTelekinesis) {
      this.usedTelekinesis = false;
      const player = effect.player;
      if (player.bench.some(b => b.cards.length > 0)) {
        state = SWITCH_ACTIVE_WITH_BENCHED(store, state, player) || state;
      }
    }

    if (effect instanceof EndTurnEffect) {
      this.usedTelekinesis = false;
    }

    return state;
  }
}
