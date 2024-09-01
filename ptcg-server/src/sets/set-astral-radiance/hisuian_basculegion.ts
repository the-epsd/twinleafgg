import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GamePhase } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class HisuianBasculegion extends PokemonCard {
  public regulationMark = 'F';
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.WATER;
  public hp: number = 120;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Hisuian Basculin';

  public attacks = [{
    name: 'Grudge Dive',
    cost: [CardType.WATER],
    damage: 30,
    damageCalculation: '+',
    text: 'If any of your Pokémon were Knocked Out by damage from an attack from your opponent\'s Pokémon during their last turn, this attack does 90 more damage, and your opponent\'s Active Pokémon is now Confused.'
  },
  {
    name: 'Jet Headbutt',
    cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
    damage: 80,
    text: ''
  }];

  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Hisuian Basculegion';
  public fullName: string = 'Hisuian Basculegion ASR';

  public readonly RETALIATE_MARKER = 'RETALIATE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.RETALIATE_MARKER);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.RETALIATE_MARKER)) {
        const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
        store.reduceEffect(state, specialConditionEffect);
        effect.damage += 90;
      }
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

    return state;
  }
}