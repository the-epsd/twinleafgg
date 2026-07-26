import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { StateUtils } from '../../../game/store/state-utils';
import { PlayerType } from '../../../game/store/actions/play-card-action';
import { GameMessage } from '../../../game/game-message';
import {
  CAN_APPLY_LOCK_TO_TARGET,
  CAN_APPLY_LOCKER_ABILITY,
  HANDLE_ABILITY_LOCK,
} from '../../../game/store/prefabs/ability-lock';

export class Garbodor extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Trubbish';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 100;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Garbotoxin',
    powerType: PowerType.ABILITY,
    text: 'If this Pokemon has a Pokemon Tool card attached to it, ' +
      'each Pokemon in play, in each player\'s hand, and in each ' +
      'player\'s discard pile has no Abilities (except for Garbotoxin).'
  }];

  public attacks = [{
    name: 'Sludge Toss',
    cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
    damage: 60,
    text: ''
  }];

  public set: string = 'DRX';

  public name: string = 'Garbodor';

  public fullName: string = 'Garbodor DRX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '54';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    HANDLE_ABILITY_LOCK(effect, ({ player, card, powerEffect }) => {
      const opponent = StateUtils.getOpponent(state, player);

      let playerHasGarbotoxin = false;
      let opponentHasGarbotoxin = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemon) => {
        if (pokemon === this && cardList.tools.length > 0) {
          playerHasGarbotoxin = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, pokemon) => {
        if (pokemon === this && cardList.tools.length > 0) {
          opponentHasGarbotoxin = true;
        }
      });

      if (!playerHasGarbotoxin && !opponentHasGarbotoxin) {
        return false;
      }

      const lockerOwner = playerHasGarbotoxin ? player : opponent;
      // Check + PowerEffect: Garbotoxin must itself be usable (e.g. Path to the Peak).
      if (!CAN_APPLY_LOCKER_ABILITY(store, state, lockerOwner, this, this.powers[0])) {
        return false;
      }
      if (powerEffect) {
        return CAN_APPLY_LOCK_TO_TARGET(store, state, lockerOwner, this, this.powers[0], card);
      }
      return true;
    }, {
      exemptPowerNames: ['Garbotoxin'],
      error: GameMessage.BLOCKED_BY_ABILITY,
    });

    return state;
  }

}
