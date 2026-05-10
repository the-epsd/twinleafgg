import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { reduceGhostVeil } from './ghost-veil';

export class Poltchageist extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 30;
  public weakness = [{ type: R }];
  public retreat = [];

  public powers = [{
    name: 'Ghost Veil',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon can\'t be affected by effects of attacks or Abilities from your opponent\'s Pokémon.',
  }];

  public attacks = [{
    name: 'Furtive Drop',
    cost: [C],
    damage: 0,
    text: 'Place 1 damage counter on your opponent\'s Active Pokémon.',
  }];

  public set: string = 'M5';
  public setNumber: string = '5';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Poltchageist';
  public fullName: string = 'Poltchageist M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    reduceGhostVeil(store, state, effect, this);

    // Ref: set-surging-sparks/uxie.ts (Return Portal — PutCountersEffect damage counter placement)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const putCounters = new PutCountersEffect(effect, 10);
      return store.reduceEffect(state, putCounters);
    }

    return state;
  }
}
