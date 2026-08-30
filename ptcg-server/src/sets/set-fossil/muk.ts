import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage, PokemonCardList, PowerType, StateUtils } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { CAN_APPLY_LOCKER_ABILITY, HANDLE_ABILITY_BLOCK, IS_ABILITY_LOCKER_IN_PLAY, POKEMON_POWER_TYPES } from '../../game/store/prefabs/ability-lock';

export class Muk extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Grimer';
  public cardType: CardType[] = [G];
  public hp: number = 70;
  public weakness = [{ type: P }];
  public resistance = [];
  public retreat = [C, C];

  public powers = [{
    name: 'Toxic Gas',
    powerType: PowerType.POKEMON_POWER,
    text: 'Ignore all Pokémon Powers other than Toxic Gases. This power stops working while Muk is Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [{
    name: 'Sludge',
    cost: [G, G, G],
    damage: 30,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name: string = 'Muk';
  public fullName: string = 'Muk FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    HANDLE_ABILITY_BLOCK(effect, ({ player, powerEffect }) => {
      if (!IS_ABILITY_LOCKER_IN_PLAY(state, player, this)) {
        return false;
      }

      try {
        const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
        if (
          cardList.specialConditions.includes(SpecialCondition.ASLEEP) ||
          cardList.specialConditions.includes(SpecialCondition.CONFUSED) ||
          cardList.specialConditions.includes(SpecialCondition.PARALYZED)
        ) {
          return false;
        }
      } catch {
        return false;
      }

      const lockerOwner = StateUtils.findOwner(state, StateUtils.findCardList(state, this));
      // Check + PowerEffect: Toxic Gas must itself be usable.
      return CAN_APPLY_LOCKER_ABILITY(store, state, lockerOwner, this, this.powers[0]);
    }, {
      powerTypes: POKEMON_POWER_TYPES,
      exemptPowerNames: ['Toxic Gas'],
      error: GameMessage.BLOCKED_BY_ABILITY,
    });

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      state = COIN_FLIP_PROMPT(store, state, player, results => {
        if (results) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
      return state;
    }
    return state;
  }
}
