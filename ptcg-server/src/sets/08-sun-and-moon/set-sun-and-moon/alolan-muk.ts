import { Card, ChooseCardsPrompt, CoinFlipPrompt, PlayerType } from '../../../game';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { StateUtils } from '../../../game/store/state-utils';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';
import {
  CAN_APPLY_LOCKER_ABILITY,
  CAN_APPLY_LOCK_TO_TARGET,
  HANDLE_ABILITY_LOCK,
  IS_ABILITY_LOCKER_IN_PLAY,
} from '../../../game/store/prefabs/ability-lock';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { GameMessage } from '../../../game/game-message';
import { PokemonCardList } from '../../../game/store/state/pokemon-card-list';

export class AlolanMuk extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Alolan Grimer';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 120;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Power of Alchemy',
    powerType: PowerType.ABILITY,
    text: 'Each Basic Pokémon in play, in each player\'s hand, and in each player\'s discard pile has no Abilities.'
  }];

  public attacks = [{
    name: 'Crunch',
    cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
    damage: 90,
    text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
  }];

  public set: string = 'SUM';

  public name: string = 'Alolan Muk';

  public fullName: string = 'Alolan Muk SUM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '58';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Defending Pokemon has no energy cards attached
      if (!opponent.active.cards.some(c => c.superType === SuperType.ENERGY)) {
        return state;
      }

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {

          let card: Card;
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.active,
            { superType: SuperType.ENERGY },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            card = selected[0];
            return store.reduceEffect(state, new DiscardCardsEffect(effect, [card]));
          });
        }
      });
    }

    HANDLE_ABILITY_LOCK(effect, ({ player, card, powerEffect }) => {
      if (!IS_ABILITY_LOCKER_IN_PLAY(state, player, this)) {
        return false;
      }

      try {
        const cardList = StateUtils.findCardList(state, card);
        if (cardList instanceof PokemonCardList) {
          if (!cardList.isStage(Stage.BASIC)) {
            return false;
          }
        } else if (card.stage !== Stage.BASIC) {
          return false;
        }
      } catch {
        if (card.stage !== Stage.BASIC) {
          return false;
        }
      }

      const opponent = StateUtils.getOpponent(state, player);
      let playerHasAlolanMukInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, pokemon) => {
        if (pokemon === this) {
          playerHasAlolanMukInPlay = true;
        }
      });
      const lockerOwner = playerHasAlolanMukInPlay ? player : opponent;

      // Check + PowerEffect: Power of Alchemy must itself be usable (e.g. Path to the Peak).
      if (!CAN_APPLY_LOCKER_ABILITY(store, state, lockerOwner, this, this.powers[0])) {
        return false;
      }
      if (powerEffect) {
        return CAN_APPLY_LOCK_TO_TARGET(store, state, lockerOwner, this, this.powers[0], card);
      }
      return true;
    }, {
      exemptPowerNames: ['Power of Alchemy'],
      error: GameMessage.BLOCKED_BY_ABILITY,
    });

    return state;
  }
}
