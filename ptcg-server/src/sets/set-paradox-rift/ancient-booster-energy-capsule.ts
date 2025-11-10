import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckHpEffect, AddSpecialConditionsPowerEffect } from '../../game/store/effects/check-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

import { PokemonCardList } from '../../game';
import { IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';

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

    // Handle TrainerEffect - clear special conditions when tool is attached
    if (effect instanceof TrainerEffect && effect.trainerCard === this && effect.target instanceof PokemonCardList) {
      const cardList = effect.target;
      const card = cardList.getPokemonCard();

      if (card && card.tags.includes(CardTag.ANCIENT)) {
        // Clear all special conditions when attached
        if (cardList.specialConditions.length > 0) {
          cardList.specialConditions = [];
        }
      }
    }

    if (effect instanceof CheckHpEffect && effect.target.tools.includes(this)) {
      const card = effect.target.getPokemonCard();

      if (card === undefined) {
        return state;
      }

      // Try to reduce ToolEffect, to check if something is blocking the tool from working
      if (IS_TOOL_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      if (card.tags.includes(CardTag.ANCIENT)) {
        effect.hp += 60;
      }
    }

    if (effect instanceof AddSpecialConditionsPowerEffect) {
      const cardList = effect.target;

      if (cardList instanceof PokemonCardList && cardList.tools.includes(this)) {
        const card = cardList.getPokemonCard();

        if (card && card.tags.includes(CardTag.ANCIENT)) {
          // Try to reduce ToolEffect, to check if something is blocking the tool from working
          if (!IS_TOOL_BLOCKED(store, state, effect.player, this)) {
            // Prevent all special conditions
            effect.specialConditions = [];
          }
        }
      }
    }

    if (effect instanceof AddSpecialConditionsEffect) {
      const cardList = effect.target;

      if (cardList instanceof PokemonCardList && cardList.tools.includes(this)) {
        const card = cardList.getPokemonCard();

        if (card && card.tags.includes(CardTag.ANCIENT)) {
          // Try to reduce ToolEffect, to check if something is blocking the tool from working
          if (!IS_TOOL_BLOCKED(store, state, effect.player, this)) {
            // Prevent all special conditions
            effect.specialConditions = [];
          }
        }
      }
    }
    return state;
  }
}
