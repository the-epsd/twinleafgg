import { TrainerCard } from '../../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { GameMessage } from '../../../game/game-message';
import { StateUtils } from '../../../game/store/state-utils';
import { GameError, Player } from '../../../game';
import {
  MOVE_CARDS,
  SWITCH_ACTIVE_WITH_BENCHED,
  SWITCH_IN_OPPONENT_BENCHED_POKEMON,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class CrossSwitcher extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'E';
  public set: string = 'FST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '230';
  public name: string = 'Cross Switcher';
  public fullName: string = 'Cross Switcher FST';
  public text: string = `You must play 2 Cross Switcher cards at once. (This effect works one time for 2 cards.)

Switch 1 of your opponent's Benched Pokémon with their Active Pokémon. If you do, switch your Active Pokémon with 1 of your Benched Pokémon.`;
  protected _tags = [CardTag.FUSION_STRIKE];

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.hand.cards.filter((c) => c.name === this.name).length < 2) {
      return false;
    }

    const opponent = StateUtils.getOpponent(state, player);
    const benchCount = opponent.bench.some((b) => b.cards.length > 0);
    if (!benchCount) {
      return false;
    }

    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const name = effect.trainerCard.name;

      // Must have another Cross Switcher in hand besides this one
      const second = player.hand.cards.find((c) => {
        return c.name === name && c !== effect.trainerCard;
      });
      if (second === undefined) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Check if opponent has any benched Pokemon
      const benchCount = opponent.bench.some((b) => b.cards.length > 0);
      if (!benchCount) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      return SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player, {
        onSwitched: () => {
          // Discard the second Cross Switcher
          MOVE_CARDS(store, state, player.hand, player.discard, {
            cards: [second],
            sourceCard: effect.trainerCard,
          });

          // Then switch your own Active Pokémon (no-op if you have no Bench)
          SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
        },
      });
    }

    return state;
  }
}
