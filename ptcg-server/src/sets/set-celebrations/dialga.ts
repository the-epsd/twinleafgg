import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AFTER_ATTACK, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Dialga extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public regulationMark: string = 'D';
  public cardType: CardType = CardType.METAL;
  public hp: number = 130;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.GRASS, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Temporal Backflow',
    cost: [CardType.METAL],
    damage: 0,
    text: 'Put a card from your discard pile into your hand.'
  },
  {
    name: 'Metal Blast',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 60,
    text: 'This attack does 20 more damage for each [M] Energy attached to this Pokemon.'
  }];

  public set: string = 'CEL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Dialga';
  public fullName: string = 'Dialga CEL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(store, state, player, this, {}, { min: 1, max: 1, allowCancel: false }, this.attacks[0]);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.METAL;
        }).length;
      });
      effect.damage += energyCount * 20;
    }

    return state;
  }
}