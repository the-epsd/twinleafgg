import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { StateUtils } from '../../../game/store/state-utils';
import { GameMessage } from '../../../game/game-message';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { CheckAttackCostEffect } from '../../../game/store/effects/check-effects';
import {
  HANDLE_ABILITY_BLOCK,
  IS_ABILITY_LOCKER_IN_PLAY,
  POKEPOWER_TYPES,
} from '../../../game/store/prefabs/ability-lock';

export class Sceptileex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Grovyle';
  protected _tags = [CardTag.POKEMON_ex, CardTag.DELTA_SPECIES];
  public cardType: CardType[] = [P];
  public hp: number = 140;
  public weakness = [{ type: G }, { type: R }];
  public resistance = [{ type: W, value: -30 }];
  public retreat = [C];

  public powers = [
    {
      name: 'Extra Liquid',
      powerType: PowerType.POKEBODY,
      text: "Each player's Pokémon-ex can't use any Poké-Powers and pays [C] more Energy to use its attacks. Each Pokémon can't be affected by more than 1 Extra Liquid Poké-Body.",
    },
  ];

  public attacks = [
    {
      name: 'Power Revenge',
      cost: [P, C],
      damage: 60,
      damageCalculation: '+',
      text: 'Does 60 damage plus 10 more damage for each Prize card your opponent has taken.',
    },
  ];

  public set: string = 'CG';
  public name: string = 'Sceptile ex';
  public fullName: string = 'Sceptile ex CG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    HANDLE_ABILITY_BLOCK(
      effect,
      ({ player, card }) => {
        if (!IS_ABILITY_LOCKER_IN_PLAY(state, player, this)) {
          return false;
        }

        let lockerOwner;
        try {
          lockerOwner = StateUtils.findOwner(state, StateUtils.findCardList(state, this));
        } catch {
          return false;
        }

        if (IS_POKEBODY_BLOCKED(store, state, lockerOwner, this)) {
          return false;
        }

        return card.hasTag(CardTag.POKEMON_ex);
      },
      {
        powerTypes: POKEPOWER_TYPES,
        error: GameMessage.BLOCKED_BY_ABILITY,
      },
    );

    if (effect instanceof CheckAttackCostEffect) {
      const player = effect.player;

      if (!IS_ABILITY_LOCKER_IN_PLAY(state, player, this)) {
        return state;
      }

      let lockerOwner;
      try {
        lockerOwner = StateUtils.findOwner(state, StateUtils.findCardList(state, this));
      } catch {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, lockerOwner, this)) {
        return state;
      }

      if (player.active.getPokemonCard()?.hasTag(CardTag.POKEMON_ex)) {
        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index > -1) {
          effect.cost.splice(index, 0, CardType.COLORLESS);
        } else {
          effect.cost.push(CardType.COLORLESS);
        }

        return state;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const prizesTaken = 6 - opponent.getPrizeLeft();
      const damagePerPrize = 10;

      effect.damage += prizesTaken * damagePerPrize;
    }

    return state;
  }
}
