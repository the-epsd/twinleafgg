import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { GameMessage, PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { AddSpecialConditionsPowerEffect, CheckTableStateEffect } from '../../../game/store/effects/check-effects';
import { CONFIRMATION_PROMPT, DISCARD_TOP_X_CARDS_FROM_YOUR_DECK, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../../game/store/prefabs/attack-effects';

export class Magcargo extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Slugma';
  public hp: number = 90;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: +20 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Magma Armor',
    powerType: PowerType.POKEBODY,
    text: 'Magcargo can\'t be Asleep or Paralyzed.'
  }];

  public attacks = [{
    name: 'Lava Plume',
    cost: [R, R, C],
    damage: 60,
    text: 'You may discard the top card of your deck. If you do, the Defending Pokémon is now Burned.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Magcargo';
  public fullName: string = 'Magcargo GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Magma Armor
    if (
      (effect instanceof AddSpecialConditionsEffect || effect instanceof AddSpecialConditionsPowerEffect) &&
      effect.target.getPokemonCard() === this
    ) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (!IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        effect.specialConditions = effect.specialConditions.filter(
          sc => sc !== SpecialCondition.ASLEEP && sc !== SpecialCondition.PARALYZED
        );
        if (effect.specialConditions.length === 0) {
          effect.preventDefault = true;
        }
      }
    }

    if (effect instanceof CheckTableStateEffect) {
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      const owner = StateUtils.findOwner(state, cardList);
      if (StateUtils.isPokemonInPlay(owner, this) && cardList.getPokemonCard() === this) {
        if (!IS_POKEBODY_BLOCKED(store, state, owner, this)) {
          cardList.removeSpecialCondition(SpecialCondition.ASLEEP);
          cardList.removeSpecialCondition(SpecialCondition.PARALYZED);
        }
      }
    }

    // Lava Plume
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.deck.cards.length === 0) {
        return state;
      }
      return CONFIRMATION_PROMPT(store, state, player, wantTo => {
        if (wantTo) {
          DISCARD_TOP_X_CARDS_FROM_YOUR_DECK(store, state, player, 1, this, effect);
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
        }
      }, GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
    }

    return state;
  }
}
