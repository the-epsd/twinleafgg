import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { PokemonCardList, StateUtils } from '../../../game';
import { BEFORE_DAMAGE } from '../../../game/store/prefabs/prefabs';
import { DISCARD_CARDS_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';
import {
  HANDLE_ABILITY_LOCK,
  IS_ABILITY_LOCKER_ACTIVE,
  LOCKER_ABILITY_APPLIES,
} from '../../../game/store/prefabs/ability-lock';
import { GameMessage } from '../../../game/game-message';

export class Klefki extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public cardType: CardType[] = [CardType.PSYCHIC];

  public hp: number = 70;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Mischievous Lock',
    powerType: PowerType.ABILITY,
    abilityLock: true,
    text: 'As long as this Pokémon is in the Active Spot, Basic ' +
      'Pokémon in play (both yours and your opponent\'s) have no ' +
      'Abilities, except for Mischievous Lock.'
  }];

  public attacks = [{
    name: 'Joust',
    cost: [CardType.COLORLESS],
    damage: 10,
    text: 'Before doing damage, discard all Pokémon Tools from your opponent\'s Active Pokémon.'
  }];

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '96';

  public name: string = 'Klefki';

  public fullName: string = 'Klefki SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    HANDLE_ABILITY_LOCK(effect, ({ player, card }) => {
      if (!IS_ABILITY_LOCKER_ACTIVE(state, player, this)) {
        return false;
      }

      const targetCardList = StateUtils.findCardList(state, card);
      if (!(targetCardList instanceof PokemonCardList)) {
        return false;
      }

      if (card.stage !== Stage.BASIC) {
        return false;
      }

      const lockerOwner = StateUtils.findOwner(state, StateUtils.findCardList(state, this));
      // Check + PowerEffect: Mischievous Lock must itself be usable (e.g. Path to the Peak).
      return LOCKER_ABILITY_APPLIES(store, state, lockerOwner, this, this.powers[0], card);
    }, {
      exemptPowerNames: ['Mischievous Lock'],
      allowUseFromHand: true,
      allowUseFromDiscard: true,
      error: GameMessage.BLOCKED_BY_ABILITY,
    });

    if (BEFORE_DAMAGE(effect, 0, this)) {
      const tools = [...effect.opponent.active.tools];
      return DISCARD_CARDS_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect, tools);
    }

    return state;
  }
}
