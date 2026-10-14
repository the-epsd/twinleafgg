import { TrainerCard } from '../../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, Player, GameError, GameMessage } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DRAW_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class CoachTrainer extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '192';
  public name: string = 'Coach Trainer';
  public fullName: string = 'Coach Trainer UNM';
  public text: string =
    'Draw 2 cards. If your Active Pokémon is a TAG TEAM Pokémon, draw 2 more cards. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      DRAW_CARDS(store, state, player, 2);

      const activePokemon = player.active.getPokemonCard();
      if (activePokemon && activePokemon.hasTag(CardTag.TAG_TEAM)) {
        DRAW_CARDS(store, state, player, 2);
      }
    }

    return state;
  }
}
