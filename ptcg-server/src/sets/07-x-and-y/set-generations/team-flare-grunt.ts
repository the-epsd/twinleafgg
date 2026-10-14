import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, StateUtils, ChooseCardsPrompt } from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { TRAINER_TARGET_BLOCKED } from '../../../game/store/prefabs/trainer-target';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class TeamFlareGrunt extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'GEN';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '73';
  public name: string = 'Team Flare Grunt';
  public fullName: string = 'Team Flare Grunt GEN';
  public text: string = "Discard an Energy attached to your opponent's Active Pokémon.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    const opponent = StateUtils.getOpponent(state, player);
    if (!opponent.active.cards.some((c) => c.superType === SuperType.ENERGY)) {
      return false;
    }
    return true;
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

      const target = opponent.active;

      if (TRAINER_TARGET_BLOCKED(store, state, player, this, target)) {
        return state;
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          target,
          { superType: SuperType.ENERGY },
          { min: 1, max: 1, allowCancel: false },
        ),
        (selected) => {
          MOVE_CARDS(store, state, target, opponent.discard, {
            cards: selected || [],
            sourceCard: this,
          });
        },
      );
    }

    return state;
  }
}
