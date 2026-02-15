import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

export class AlolanVulpix extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: M }];
  public retreat = [C];

  public usedRoar: boolean = false;

  public attacks = [
    {
      name: 'Roar',
      cost: [],
      damage: 0,
      text: 'Your opponent switches their Active Pokémon with 1 of their Benched Pokémon.'
    },
    {
      name: 'Icy Snow',
      cost: [W],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Alolan Vulpix';
  public fullName: string = 'Alolan Vulpix UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Roar
    // Ref: AGENTS-patterns.md (Post-Damage Switching - AfterAttackEffect pattern)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedRoar = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedRoar) {
      this.usedRoar = false;
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.bench.some(b => b.cards.length > 0)) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
      }
    }

    if (effect instanceof EndTurnEffect) {
      this.usedRoar = false;
    }

    return state;
  }
}
