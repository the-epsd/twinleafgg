import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Petilil extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 50;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Spin Turn',
    cost: [G],
    damage: 10,
    text: 'Switch this Pokémon with 1 of your Benched Pokémon.',
  }];

  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '15';
  public name: string = 'Petilil';
  public fullName: string = 'Petilil ASR';

  public usedSpinTurn = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedSpinTurn = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedSpinTurn === true) {
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
    }

    if (effect instanceof EndTurnEffect && this.usedSpinTurn) {
      this.usedSpinTurn = false;
    }

    return state;
  }
}