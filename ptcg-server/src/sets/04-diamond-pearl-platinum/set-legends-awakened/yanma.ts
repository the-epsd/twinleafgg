import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { AfterAttackEffect, EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Yanma extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [G];
  public weakness = [{ type: L, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'U-turn',
    cost: [C],
    damage: 10,
    text: 'Switch Yanma with 1 of your Benched Pokémon.'
  },
  {
    name: 'Agility',
    cost: [G, G],
    damage: 20,
    text: 'Flip a coin. If heads, prevent all effects of an attack, including damage, done to Yanma during your opponent\'s next turn.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '128';
  public name: string = 'Yanma';
  public fullName: string = 'Yanma LA';

  public usedSwitchAttack0 = false;
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // U-turn
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedSwitchAttack0 = true;
    }

    // Agility
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this);
    }

    if (effect instanceof AfterAttackEffect && this.usedSwitchAttack0) {
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
    }
    if (effect instanceof EndTurnEffect) {
      this.usedSwitchAttack0 = false;
    }
    return state;
  }
}
