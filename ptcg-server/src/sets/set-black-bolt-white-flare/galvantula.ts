import { Card, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Galvantula extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Joltik';
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Discharge',
    cost: [L],
    damage: 0,
    damageCalculation: 'x',
    text: 'Discard all [L] Energy from this Pokémon. This attack does 50 damage for each card you discarded in this way.'
  }];

  public set: string = 'WHT';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';
  public name: string = 'Galvantula';
  public fullName: string = 'Galvantula SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const lightningEnergies = checkProvidedEnergy.energyMap.filter(e => e.provides.includes(CardType.LIGHTNING));
      const cards: Card[] = lightningEnergies.map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      const totalDiscarded = discardEnergy.cards.length;
      store.reduceEffect(state, discardEnergy);

      effect.damage = totalDiscarded * 50;
    }
    return state;
  }
}
