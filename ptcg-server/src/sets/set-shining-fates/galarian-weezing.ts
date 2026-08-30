import { GameMessage } from '../../game/game-message';
import {
  CardType,
  SpecialCondition,
  Stage,
} from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import {
  HANDLE_ABILITY_LOCK,
  IS_ABILITY_LOCKER_ACTIVE,
  LOCKER_ABILITY_APPLIES,
} from '../../game/store/prefabs/ability-lock';
import { PlayerType, PokemonCardList } from '../../game';

export class GalarianWeezing extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public regulationMark = 'D';
  public cardType: CardType[] = [D];
  public evolvesFrom = 'Koffing';
  public hp: number = 130;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public powers = [
    {
      name: 'Neutralizing Gas',
      powerType: PowerType.ABILITY,
      abilityLock: true,
      text: "As long as this Pokémon is in the Active Spot, your opponent's Pokémon in play have no Abilities, except for Neutralizing Gas.",
    },
  ];

  public attacks = [
    {
      name: 'Severe Poison',
      cost: [D],
      damage: 0,
      text: "Your opponent's Active Pokémon is now Poisoned. Put 4 damage counters instead of 1 on that Pokémon during Pokémon Checkup.",
    },
  ];

  public set: string = 'SHF';
  public name: string = 'Galarian Weezing';
  public fullName: string = 'Galarian Weezing SHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [
        SpecialCondition.POISONED,
      ]);
      specialCondition.poisonDamage = 40;
      store.reduceEffect(state, specialCondition);
    }

    HANDLE_ABILITY_LOCK(effect, ({ player, card }) => {
      if (!IS_ABILITY_LOCKER_ACTIVE(state, player, this)) {
        return false;
      }

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      const opponent = StateUtils.getOpponent(state, owner);

      let targetBelongsToOpponent = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (_list, pokemon) => {
        if (pokemon === card) {
          targetBelongsToOpponent = true;
        }
      });
      if (!targetBelongsToOpponent) {
        return false;
      }

      const targetCardList = StateUtils.findCardList(state, card);
      if (!(targetCardList instanceof PokemonCardList)) {
        return false;
      }

      // Check + PowerEffect: Neutralizing Gas must itself be usable (e.g. Path to the Peak).
      return LOCKER_ABILITY_APPLIES(store, state, owner, this, this.powers[0], card);
    }, {
      exemptPowerNames: ['Neutralizing Gas'],
      allowUseFromHand: true,
      allowUseFromDiscard: true,
      error: GameMessage.BLOCKED_BY_ABILITY,
    });

    return state;
  }
}
