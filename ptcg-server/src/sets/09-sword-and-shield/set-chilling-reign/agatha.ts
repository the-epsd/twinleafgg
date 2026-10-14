import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { StateUtils } from '../../../game/store/state-utils';
import { PlayerType, SlotType } from '../../../game/store/actions/play-card-action';
import { MoveDamagePrompt, DamageMap } from '../../../game/store/prompts/move-damage-prompt';
import { GameMessage } from '../../../game/game-message';
import {
  CardTarget,
  GameError,
  Player,
  TrainerCard,
  TrainerType,
} from '../../../game';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Agatha extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'E';
  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '129';
  public name: string = 'Agatha';
  public fullName: string = 'Agatha CRE';
  public text: string =
    "Move up to 3 damage counters from 1 of your Pokémon to your opponent's Active Pokémon.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    let hasDamaged = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      if (cardList.damage >= 10) {
        hasDamaged = true;
      }
    });
    return hasDamaged;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (!this.canPlay(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });
      effect.preventDefault = true;

      const blockedFrom: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, _card, target) => {
        if (cardList.damage < 10) {
          blockedFrom.push(target);
        }
      });

      const blockedTo: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, _card, target) => {
        blockedTo.push(target);
      });
      opponent.bench.forEach((bench, index) => {
        if (bench.cards.length > 0) {
          blockedTo.push({ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index });
        }
      });

      const maxAllowedDamage: DamageMap[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, _card, target) => {
        const checkHpEffect = new CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });

      return store.prompt(
        state,
        new MoveDamagePrompt(
          player.id,
          GameMessage.MOVE_DAMAGE,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          maxAllowedDamage,
          {
            min: 1,
            max: 3,
            allowCancel: false,
            blockedFrom,
            blockedTo,
            singleSourceTarget: true,
            singleDestinationTarget: true,
          },
        ),
        (transfers) => {
          if (!transfers || transfers.length === 0) {
            return;
          }

          for (const transfer of transfers) {
            const source = StateUtils.getTarget(state, player, transfer.from);
            const target = StateUtils.getTarget(state, player, transfer.to);
            if (source.damage >= 10) {
              source.damage -= 10;
              target.damage += 10;
            }
          }
        },
      );
    }

    return state;
  }
}
