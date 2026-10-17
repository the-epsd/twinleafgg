import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DRAW_CARDS, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { AfterAttackEffect, EndTurnEffect } from '../../../game/store/effects/game-phase-effects';

export class Dunsparce extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Snake Hook',
    cost: [],
    damage: 0,
    text: 'Draw a card.'
  },
{
    name: 'Bite and Run',
    cost: [],
    damage: 10,
    text: 'Switch Dunsparce with 1 of your Benched Pokémon.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Dunsparce';
  public fullName: string = 'Dunsparce MT';

  public usedSwitchAttack1 = false;
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Snake Hook
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS(store, state, player, 1);
    }

    // Bite and Run
    if (WAS_ATTACK_USED(effect, 1, this)) {
      this.usedSwitchAttack1 = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedSwitchAttack1) {
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
    }
    if (effect instanceof EndTurnEffect) {
      this.usedSwitchAttack1 = false;
    }
    return state;
  }
}
