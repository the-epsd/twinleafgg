import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { StoreLike, State, PowerType, GameMessage, StateUtils, PokemonCardList } from '../../../game';
import {
  CAN_APPLY_LOCKER_ABILITY,
  HANDLE_ABILITY_LOCK,
  IS_ABILITY_LOCKER_IN_PLAY,
} from '../../../game/store/prefabs/ability-lock';

export class Psyduck extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Damp',
    powerType: PowerType.ABILITY,
    text: 'Pokémon in play (both yours and your opponent\'s) lose any Ability that requires the Pokémon using it to Knock Out itself.'
  }];

  public attacks = [{
    name: 'Ram',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'MEP';
  public setNumber = '7';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Psyduck';
  public fullName: string = 'Psyduck SVP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    HANDLE_ABILITY_LOCK(effect, ({ player, card }) => {
      if (!IS_ABILITY_LOCKER_IN_PLAY(state, player, this)) {
        return false;
      }

      try {
        if (!(StateUtils.findCardList(state, card) instanceof PokemonCardList)) {
          return false;
        }
      } catch {
        return false;
      }

      const lockerOwner = StateUtils.findOwner(state, StateUtils.findCardList(state, this));
      // Check + PowerEffect: Damp must itself be usable (e.g. Path to the Peak).
      return CAN_APPLY_LOCKER_ABILITY(store, state, lockerOwner, this, this.powers[0]);
    }, {
      onlyKnocksOutSelf: true,
      exemptPowerNames: ['Damp'],
      allowUseFromHand: true,
      allowUseFromDiscard: true,
      error: GameMessage.BLOCKED_BY_ABILITY,
    });

    return state;
  }
}
