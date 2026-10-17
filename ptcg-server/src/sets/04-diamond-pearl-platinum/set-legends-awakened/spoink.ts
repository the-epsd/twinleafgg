import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../../game/store/prefabs/attack-effects';
import { SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { AfterAttackEffect, EndTurnEffect } from '../../../game/store/effects/game-phase-effects';

export class Spoink extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Psybeam',
    cost: [P],
    damage: 0,
    text: 'The Defending Pokémon is now Confused.'
  },
  {
    name: 'Bounce',
    cost: [C, C],
    damage: 20,
    text: 'You may switch Spoink with 1 of your Benched Pokémon.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '121';
  public name: string = 'Spoink';
  public fullName: string = 'Spoink LA';

  public usedSwitchAttack1 = false;
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Psybeam
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
    }

    // Bounce
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
