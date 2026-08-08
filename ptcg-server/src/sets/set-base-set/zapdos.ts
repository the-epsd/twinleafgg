import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';

import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Card } from '../../game';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Zapdos extends PokemonCard {
  public set = 'BS';
  public name = 'Zapdos';
  public fullName = 'Zapdos BS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '16';

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 90;
  public resistance = [{
    type: F,
    value: -30
  }];
  public retreat: CardType[] = [C, C, C];

  public attacks: Attack[] = [
    {
      name: 'Thunder',
      cost: [L, L, L, C],
      damage: 60,
      text: 'Flip a coin. If tails, Zapdos does 30 damage to itself.'
    },
    {
      name: 'Thunderbolt',
      cost: [L, L, L, L],
      damage: 100,
      text: 'Discard all Energy cards attached to Zapdos in order to use this attack.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {

      return COIN_FLIP_PROMPT(store, state, effect.player, tails => {
        if (tails) {
          const damageEffect = new DealDamageEffect(effect, 30);
          damageEffect.target = effect.player.active;
          store.reduceEffect(state, damageEffect);
        }
      });

    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const cards: Card[] = checkProvidedEnergy.energyMap.map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);
    }

    return state;

  }

}