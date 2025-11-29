import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
import { AttackEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Rayquaza extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 120;
  public weakness = [];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Assault Break',
    cost: [L, C],
    damage: 20,
    damageCalculation: '+',
    text: 'If this Pokémon moved from your Bench to the Active Spot this turn, this attack does 90 more damage.'
  },
  {
    name: 'Dragon Claw',
    cost: [R, L, C],
    damage: 130,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'M2a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '127';
  public name: string = 'Rayquaza';
  public fullName: string = 'Rayquaza M2a';

  public movedToActiveThisTurn = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Reset flag at end of turn
    if (effect instanceof EndTurnEffect && this.movedToActiveThisTurn) {
      this.movedToActiveThisTurn = false;
    }

    // Set flag when another Pokemon retreats (this one might be switching in)
    if (effect instanceof RetreatEffect && effect.player.active.getPokemonCard() !== this) {
      this.movedToActiveThisTurn = true;
    }

    // Handle Assault Break attack - add 90 damage if moved from bench this turn
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      if (this.movedToActiveThisTurn) {
        effect.damage += 90;
      }
    }

    return state;
  }
}