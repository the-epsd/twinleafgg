import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { EvolveEffect } from '../../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { ADD_MARKER, HAS_MARKER, MULTIPLE_COIN_FLIPS_PROMPT, REMOVE_MARKER, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Vigoroth extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Slakoth';
  public hp: number = 80;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Wake-up Punch',
    cost: [C],
    damage: 10,
    text: 'If Vigoroth evolved from Slakoth during this turn and Slakoth was Asleep, this attack\'s base damage is 60 instead of 10.'
  },
  {
    name: 'Fury Swipes',
    cost: [C, C, C],
    damage: 30,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 30 damage times the number of heads.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';
  public name: string = 'Vigoroth';
  public fullName: string = 'Vigoroth MT';

  public readonly SLAKOTH_WAS_ASLEEP_MARKER = 'SLAKOTH_WAS_ASLEEP_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Track whether Slakoth was Asleep when evolving into Vigoroth
    if (effect instanceof EvolveEffect && effect.pokemonCard === this) {
      if (effect.target.specialConditions.includes(SpecialCondition.ASLEEP)) {
        ADD_MARKER(this.SLAKOTH_WAS_ASLEEP_MARKER, effect.player, this);
      }
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.SLAKOTH_WAS_ASLEEP_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.SLAKOTH_WAS_ASLEEP_MARKER, effect.player, this);
    }

    // Wake-up Punch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (
        player.active.pokemonPlayedTurn === state.turn
        && HAS_MARKER(this.SLAKOTH_WAS_ASLEEP_MARKER, player, this)
      ) {
        effect.damage = 60;
      }
    }

    // Fury Swipes
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => {
        effect.damage = 30 * results.filter(r => r).length;
      });
    }

    return state;
  }
}
