import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { AfterAttackEffect, EndTurnEffect } from '../../../game/store/effects/game-phase-effects';

export class Murkrow extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [D];
  public weakness = [{ type: L, value: +10 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Swarm',
    cost: [],
    damage: 0,
    text: 'Search your deck for Murkrow and put it onto your Bench. Shuffle your deck afterward.'
  },
  {
    name: 'Hide Crowd',
    cost: [C, C],
    damage: 20,
    text: 'Switch Murkrow with 1 of your Benched Pokémon.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '90';
  public name: string = 'Murkrow';
  public fullName: string = 'Murkrow MT';

  public usedSwitchAttack1 = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Swarm
    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(
        store, state, effect.player, { name: 'Murkrow' }, { min: 0, max: 1 }
      );
    }

    // Hide Crowd
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
