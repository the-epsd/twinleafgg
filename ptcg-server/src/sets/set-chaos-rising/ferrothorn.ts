import { CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';
import { EnergyCard } from '../../game/store/card/energy-card';
import { PokemonCard, StateUtils, StoreLike, State } from '../../game';
import { DISCARD_TOP_X_OF_OPPONENTS_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Ferrothorn extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Ferroseed';
  public hp: number = 130;
  public cardType: CardType = M;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];
  public powers = [{
    name: 'Prank Drop',
    powerType: PowerType.ABILITY,
    text: 'When this Pokemon is discarded from your deck by your opponent\'s effect, your opponent discards the top 8 cards of their deck.'
  }];
  public attacks = [{
    name: 'Special Whip',
    cost: [M, M, C],
    damage: 70,
    damageCalculation: '+' as '+',
    text: 'If this Pokemon has any Special Energy attached, this attack does 70 more damage.'
  }];
  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public name: string = 'Ferrothorn';
  public fullName: string = 'Ferrothorn M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof MoveCardsEffect) {
      const cards = effect.cards || [];
      if (!cards.includes(this)) return state;
      if (effect.source === undefined || effect.destination === undefined) return state;
      try {
        const deckOwner = StateUtils.findOwner(state, effect.source);
        const effectOwner = effect.sourceCard ? StateUtils.findOwner(state, StateUtils.findCardList(state, effect.sourceCard)) : null;
        if (effect.source !== deckOwner.deck || effect.destination !== deckOwner.discard) return state;
        if (effectOwner !== deckOwner) {
          DISCARD_TOP_X_OF_OPPONENTS_DECK(store, state, deckOwner, 8, this, effect);
        }
      } catch {
        return state;
      }
    }
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const hasSpecialEnergy = effect.source?.cards.some((c: any) => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL);
      if (hasSpecialEnergy) {
        effect.damage += 70;
      }
    }
    return state;
  }
}
