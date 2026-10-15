import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealTargetEffect } from '../../../game/store/effects/attack-effects';
import { ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Lairon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Aron';
  public hp: number = 80;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Mend',
    cost: [M],
    damage: 0,
    text: 'Search your discard pile for a Metal Energy card and attach it to Lairon. If you do, remove 2 damage counters from Lairon.'
  },
  {
    name: 'Confront',
    cost: [M, M, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';
  public name: string = 'Lairon';
  public fullName: string = 'Lairon MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mend
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON(store, state, player, 1, CardType.METAL, {
        destinationSlots: [SlotType.ACTIVE],
        min: 0,
        allowCancel: true,
        onAttached: (transfers) => {
          if (transfers.length > 0) {
            const healEffect = new HealTargetEffect(effect, 20);
            healEffect.target = player.active;
            store.reduceEffect(state, healEffect);
          }
        },
      });
    }

    return state;
  }
}
