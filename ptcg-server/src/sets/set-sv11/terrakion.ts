import { PokemonCard, Stage, CardType, State, StoreLike, GamePhase, StateUtils } from '../../game';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Terrakion extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 140;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Retaliate',
    cost: [F, C],
    damage: 50,
    damageCalculation: '+',
    text: 'If any of your Pokémon were Knocked Out by damage from an attack during your opponent\'s last turn, this attack does 80 more damage.'
  },
  {
    name: 'Land Crush',
    cost: [F, F, C],
    damage: 100,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'SV11W';
  public setNumber: string = '51';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Terrakion';
  public fullName: string = 'Terrakion SV11W';

  public readonly RETALIATE_MARKER = 'RETALIATE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: any): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.RETALIATE_MARKER)) {
        effect.damage += 80;
      }
      return state;
    }

    if (effect instanceof KnockOutEffect && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner === player) {
        effect.player.marker.addMarkerToState(this.RETALIATE_MARKER);
      }
      return state;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.RETALIATE_MARKER)) {
      effect.player.marker.removeMarker(this.RETALIATE_MARKER);
    }
    return state;
  }
} 