import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AfterAttackEffect, EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import {
  MOVED_TO_ACTIVE_THIS_TURN,
  WAS_ATTACK_USED,
  BLOCK_IF_GX_ATTACK_USED,
  SWITCH_ACTIVE_WITH_BENCHED,
} from '../../../game/store/prefabs/prefabs';

export class GolisopodGx extends PokemonCard {
  protected _tags = [CardTag.POKEMON_GX];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Wimpod';
  public cardType: CardType = G;
  public hp: number = 210;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public usedCrossingCutGx = false;

  public attacks = [{
    name: 'First Impression',
    cost: [G],
    damage: 30,
    damageCalculation: '+',
    text: 'If this Pokémon was on the Bench and became your Active Pokémon this turn, this attack does 90 more damage.'
  },
  {
    name: 'Armor Press',
    cost: [G, C, C],
    damage: 100,
    text: 'During your opponent\'s next turn, this Pokémon takes 20 less damage from attacks (after applying Weakness and Resistance).'
  },
  {
    name: 'Crossing Cut-GX',
    cost: [G, C, C],
    damage: 150,
    text: 'Switch this Pokémon with 1 of your Benched Pokémon. (You can\'t use more than 1 GX attack in a game.)'
  }];

  public set: string = 'BUS';
  public setNumber: string = '17';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Golisopod-GX';
  public fullName: string = 'Golisopod-GX BUS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // First Impression
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (MOVED_TO_ACTIVE_THIS_TURN(effect.player, this)) {
        effect.damage += 90;
      }
    }

    // Armor Press
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.damageReductionNextTurn = 20;
    }

    // Crossing Cut-GX
    if (WAS_ATTACK_USED(effect, 2, this)) {
      BLOCK_IF_GX_ATTACK_USED(effect.player);
      effect.player.usedGX = true;
      this.usedCrossingCutGx = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedCrossingCutGx) {
      this.usedCrossingCutGx = false;
      const player = effect.player;

      if (player.bench.some((b) => b.cards.length > 0)) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      }
    }

    if (effect instanceof EndTurnEffect) {
      this.usedCrossingCutGx = false;
    }

    return state;
  }
}
