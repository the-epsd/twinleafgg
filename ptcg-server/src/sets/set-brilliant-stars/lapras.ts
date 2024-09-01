import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Lapras extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 130;

  public weakness = [{
    type: CardType.LIGHTNING
  }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Raging Freeze',
    cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
    damage: 110,
    text:
      'If any of your Pokémon were Knocked Out by damage from an attack from your opponent\'s Pokémon during their last turn, your opponent\'s Active Pokémon is now Paralyzed.'
  }];

  public set: string = 'BRS';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '31';

  public name: string = 'Lapras';

  public fullName: string = 'Lapras BRS';

  public readonly RETALIATE_MARKER = 'RETALIATE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.RETALIATE_MARKER)) {
        const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
        store.reduceEffect(state, specialConditionEffect);
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

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.RETALIATE_MARKER);
    }

    return state;
  }

}
