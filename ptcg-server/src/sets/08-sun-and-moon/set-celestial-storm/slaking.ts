import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils, PokemonCardList } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  HANDLE_ABILITY_LOCK,
  LOCKER_ABILITY_APPLIES,
} from '../../../game/store/prefabs/ability-lock';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { GameMessage } from '../../../game/game-message';

export class Slaking extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Vigoroth';
  public cardType: CardType[] = [C];
  public hp: number = 160;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Lazy',
    powerType: PowerType.ABILITY,
    abilityLock: true,
    text: 'As long as this Pokémon is your Active Pokémon, your opponent\'s Pokémon in play have no Abilities, except for Lazy.'
  }];

  public attacks = [{
    name: 'Critical Move',
    cost: [C, C, C],
    damage: 160,
    text: 'Discard an Energy from this Pokémon. It can\'t attack during your next turn.'
  }];

  public set: string = 'CES';
  public setNumber: string = '115';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Slaking';
  public fullName: string = 'Slaking CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    HANDLE_ABILITY_LOCK(effect, ({ card }) => {
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner.active.getPokemonCard() !== this) {
        return false;
      }

      try {
        const targetCardList = StateUtils.findCardList(state, card);
        const targetOwner = StateUtils.findOwner(state, targetCardList);
        if (targetOwner === owner || !(targetCardList instanceof PokemonCardList)) {
          return false;
        }
      } catch {
        return false;
      }

      // Check + PowerEffect: Lazy must itself be usable (e.g. Path to the Peak).
      return LOCKER_ABILITY_APPLIES(store, state, owner, this, this.powers[0], card);
    }, {
      exemptPowerNames: ['Lazy'],
      error: GameMessage.BLOCKED_BY_ABILITY,
    });

    // Critical Move
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
      player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}
