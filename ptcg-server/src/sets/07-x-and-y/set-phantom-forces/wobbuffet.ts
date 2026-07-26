import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { StateUtils } from '../../../game/store/state-utils';
import { PokemonCardList } from '../../../game/store/state/pokemon-card-list';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';
import {
  CAN_APPLY_LOCK_TO_TARGET,
  HANDLE_ABILITY_LOCK,
  IS_ABILITY_LOCKER_ACTIVE,
  LOCKER_ABILITY_APPLIES,
} from '../../../game/store/prefabs/ability-lock';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { GameMessage } from '../../../game/game-message';

export class Wobbuffet extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 110;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Bide Barricade',
    powerType: PowerType.ABILITY,
    abilityLock: true,
    text: 'As long as this Pokemon is your Active Pokemon, each Pokemon in ' +
      'play, in each player\'s hand, and in each player\'s discard pile has ' +
      'no Abilities (except for [P] Pokémon).'
  }];

  public attacks = [{
    name: 'Psychic Assault',
    cost: [P, C],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 10 more damage for each damage counter on ' +
      'your opponent\'s Active Pokemon.'
  }];

  public set: string = 'PHF';
  public name: string = 'Wobbuffet';
  public fullName: string = 'Wobbuffet PHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '36';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.damage += effect.opponent.active.damage;
      return state;
    }

    HANDLE_ABILITY_LOCK(effect, ({ player, card }) => {
      if (!IS_ABILITY_LOCKER_ACTIVE(state, player, this)) {
        return false;
      }

      // Psychic Pokémon keep Abilities everywhere Bide Barricade reaches
      // (in play, hand, and discard). In play uses CheckPokemonTypeEffect;
      // hand/discard use the printed type.
      try {
        const cardList = StateUtils.findCardList(state, card);
        if (cardList instanceof PokemonCardList) {
          const checkPokemonType = new CheckPokemonTypeEffect(cardList);
          store.reduceEffect(state, checkPokemonType);
          if (checkPokemonType.cardTypes.includes(CardType.PSYCHIC)) {
            return false;
          }
        } else if (card.cardType === CardType.PSYCHIC) {
          return false;
        }
      } catch {
        return false;
      }

      const opponent = StateUtils.getOpponent(state, player);
      const lockerOwner = player.active.getPokemonCard() === this ? player : opponent;

      if (!LOCKER_ABILITY_APPLIES(store, state, lockerOwner, this, this.powers[0], card)) {
        return false;
      }
      if (!CAN_APPLY_LOCK_TO_TARGET(store, state, lockerOwner, this, this.powers[0], card)) {
        return false;
      }

      return true;
    }, {
      exemptPowerNames: ['Bide Barricade'],
      error: GameMessage.BLOCKED_BY_ABILITY,
    });

    return state;
  }
}
