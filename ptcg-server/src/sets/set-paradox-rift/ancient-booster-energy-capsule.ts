import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, SpecialCondition, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckHpEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';

import { StateUtils, PokemonCardList } from '../../game';
import {ToolEffect} from '../../game/store/effects/play-card-effects';

export class AncientBoosterEnergyCapsule extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public regulationMark = 'G';

  public tags = [CardTag.ANCIENT];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '159';

  public name: string = 'Ancient Booster Energy Capsule';

  public fullName: string = 'Ancient Booster Energy Capsule PAR';

  public text: string =
    'The Ancient Pokémon this card is attached to gets +60 HP, recovers from all Special Conditions, and can\'t be affected by any Special Conditions.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckHpEffect && effect.target.cards.includes(this)) {
      const card = effect.target.getPokemonCard();

      if (card === undefined) {
        return state;
      }

      // Try to reduce ToolEffect, to check if something is blocking the tool from working
      try {
        const stub = new ToolEffect(effect.player, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      if (card.tags.includes(CardTag.ANCIENT)) {
        effect.hp += 60;
      }
    }

    if (effect instanceof CheckTableStateEffect) {
      const cardList = StateUtils.findCardList(state, this);

      // Try to reduce ToolEffect, to check if something is blocking the tool from working
      try {
        const stub = new ToolEffect(effect.player, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      if (cardList instanceof PokemonCardList && cardList.tools.includes(this)) {
        const card = cardList.getPokemonCard();
        if (card && card.tags.includes(CardTag.ANCIENT)) {
          const hasSpecialCondition = cardList.specialConditions.some(condition => condition !== SpecialCondition.ABILITY_USED);
          if (hasSpecialCondition) {
            cardList.specialConditions = cardList.specialConditions.filter(condition => condition === SpecialCondition.ABILITY_USED);
          }
        }
      }
    }
    return state;
  }
}
