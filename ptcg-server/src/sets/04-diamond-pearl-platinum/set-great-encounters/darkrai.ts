import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { ConfirmPrompt, GameMessage, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AfterAttackEffect, EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Darkrai extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F, value: +20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Darkness Roar',
    cost: [C],
    damage: 10,
    text: 'You may have your opponent switch the Defending Pokémon with 1 or his or her Benched Pokémon.'
  },
  {
    name: 'Sleep Hole',
    cost: [D, D, C],
    damage: 40,
    damageCalculation: '+',
    text: 'If the Defending Pokémon is Asleep, this attack does 40 damage plus 40 more damage. If the Defending Pokémon is not Asleep, that Pokémon is now Asleep.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Darkrai';
  public fullName: string = 'Darkrai GE';

  public usedDarknessRoar = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Darkness Roar
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      if (opponent.bench.some(b => b.cards.length > 0)) {
        this.usedDarknessRoar = true;
      }
    }

    if (effect instanceof AfterAttackEffect && this.usedDarknessRoar) {
      this.usedDarknessRoar = false;
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (!opponent.bench.some(b => b.cards.length > 0)) {
        return state;
      }
      return store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_SWITCH_POKEMON
      ), wantToSwitch => {
        if (wantToSwitch) {
          SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
        }
      });
    }

    if (effect instanceof EndTurnEffect) {
      this.usedDarknessRoar = false;
    }

    // Sleep Hole
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.specialConditions.includes(SpecialCondition.ASLEEP)) {
        effect.damage += 40;
      } else {
        ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
      }
    }

    return state;
  }
}
