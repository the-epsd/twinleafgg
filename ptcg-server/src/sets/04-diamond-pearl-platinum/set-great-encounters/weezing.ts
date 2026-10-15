import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { BetweenTurnsEffect } from '../../../game/store/effects/game-phase-effects';
import { COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Weezing extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Koffing';
  public hp: number = 80;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Toxic Virus',
    powerType: PowerType.POKEBODY,
    text: 'At any time between turns, each player puts 1 more damage counter on his or her Poisoned Pokémon.'
  }];

  public attacks = [{
    name: 'Offensive Gas',
    cost: [P, C],
    damage: 30,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused and Poisoned.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';
  public name: string = 'Weezing';
  public fullName: string = 'Weezing GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Toxic Virus
    if (effect instanceof BetweenTurnsEffect) {
      const owner = StateUtils.findOwner(state, StateUtils.findCardList(state, this));
      if (!StateUtils.isPokemonInPlay(owner, this)) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }
      if (effect.player.active.specialConditions.includes(SpecialCondition.POISONED)) {
        effect.poisonDamage += 10;
      }
    }

    // Offensive Gas
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          opponent.active.addSpecialCondition(SpecialCondition.CONFUSED);
          opponent.active.addSpecialCondition(SpecialCondition.POISONED);
        }
      });
    }

    return state;
  }
}
