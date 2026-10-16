import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { EnergyCard, PlayerType, SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { ATTACH_ENERGY_PROMPT, DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Kyogre extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 100;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Drizzle',
    cost: [],
    damage: 0,
    text: 'Choose up to 2 basic Water Energy cards from your hand and attach them to 1 of your Pokémon.'
  },
  {
    name: 'High Tide',
    cost: [W, W, C],
    damage: 60,
    text: 'Discard 2 Water Energy attached to Kyogre. This attack does 20 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  public name: string = 'Kyogre';
  public fullName: string = 'Kyogre LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Drizzle
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const basicEnergyCount = player.hand.cards.filter(c =>
        c.superType === SuperType.ENERGY && (c as EnergyCard).energyType === EnergyType.BASIC
        && (c as EnergyCard).provides.includes(CardType.WATER)
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
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
        { min: count, max: count, allowCancel: false, sameTarget: true }
      );
    }

    // High Tide
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const waterEnergy = player.active.cards.filter(c =>
        c.superType === SuperType.ENERGY
        && c.energyType === EnergyType.BASIC
        && (c as EnergyCard).provides.includes(CardType.WATER)
      );
      if (waterEnergy.length >= 2) {
        store.reduceEffect(state, new DiscardCardsEffect(effect, waterEnergy.slice(0, 2)));
      }
      const targets = effect.opponent.bench.filter(b => b.cards.length > 0);
      DAMAGE_OPPONENT_POKEMON(store, state, effect, 20, targets);
    }

    return state;
  }
}
