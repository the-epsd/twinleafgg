import { CardTag, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, StateUtils } from '../../../game';
import { MOVE_CARDS, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class TeamRocketsHandiwork extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  protected _tags = [CardTag.TEAM_ROCKET];
  public set: string = 'FCO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '112';
  public name: string = "Team Rocket's Handiwork";
  public fullName: string = "Team Rocket's Handiwork FCO";
  public text: string =
    "Flip 2 coins. For each heads, discard 2 cards from the top of your opponent's deck.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
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

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, (results) => {
        const heads = results.filter((r) => !!r).length;
        MOVE_CARDS(store, state, opponent.deck, opponent.discard, {
          count: heads * 2,
          sourceCard: this,
        });
      });
    }

    return state;
  }
}
