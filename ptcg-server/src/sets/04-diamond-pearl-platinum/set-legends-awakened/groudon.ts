import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { EnergyCard, PlayerType, SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';
import { ATTACH_ENERGY_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';

export class Groudon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 100;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G, value: +20 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Drought',
    cost: [],
    damage: 0,
    text: 'Choose up to 2 basic Fighting Energy cards from your hand and attach them to 1 of your Pokémon.'
  },
  {
    name: 'Major Earthquake',
    cost: [F, F, C],
    damage: 100,
    text: 'Discard 2 Fighting Energy attached to Groudon and this attack does 10 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '29';
  public name: string = 'Groudon';
  public fullName: string = 'Groudon LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Drought
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const basicEnergyCount = player.hand.cards.filter(c =>
        c.superType === SuperType.ENERGY && (c as EnergyCard).energyType === EnergyType.BASIC
        && (c as EnergyCard).provides.includes(CardType.FIGHTING),
      ).length;
      if (basicEnergyCount === 0) {
        return state;
      }
      const count = Math.min(2, basicEnergyCount);
      return ATTACH_ENERGY_PROMPT(
        store,
        state,
        player,
        PlayerType.BOTTOM_PLAYER,
        SlotType.HAND,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: count, max: count, allowCancel: false, sameTarget: true },
      );
    }

    // Major Earthquake
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2, CardType.FIGHTING);
      player.bench.forEach(bench => {
        if (bench.cards.length === 0) {
          return;
        }
        const countersEffect = new PutCountersEffect(effect, 10);
        countersEffect.target = bench;
        store.reduceEffect(state, countersEffect);
      });
    }

    return state;
  }
}
