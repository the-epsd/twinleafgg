import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { IS_POKEMON_POWER_BLOCKED, WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Snorlax extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -30 }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Thick Skinned',
    powerType: PowerType.POKEMON_POWER,
    text: 'Snorlax can\'t become Asleep, Confused, Paralyzed, or Poisoned. This power can\'t be used if Snorlax is already Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [{
    name: 'Body Slam',
    cost: [C, C, C, C],
    damage: 30,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'JU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';
  public name: string = 'Snorlax';
  public fullName: string = 'Snorlax JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckTableStateEffect) {
      const player = state.players[state.activePlayer];
      const cardList = StateUtils.findCardList(state, this);

      // Try reducing ability
      if (IS_POKEMON_POWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (cardList instanceof PokemonCardList && cardList.getPokemonCard() === this) {
        cardList.specialConditions = cardList.specialConditions.filter(condition =>
          condition !== SpecialCondition.ASLEEP &&
          condition !== SpecialCondition.CONFUSED &&
          condition !== SpecialCondition.PARALYZED
        );
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      state = COIN_FLIP_PROMPT(store, state, player, results => {
        if (results) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
      return state;
    }

    return state;
  }
}