import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerCard, Player, StoreLike, State, GameError, GameMessage } from '../../../game';
import { DRAW_CARDS, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Iscan extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'F';
  public set: string = 'LOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '158';
  public name: string = 'Iscan';
  public fullName: string = 'Iscan LOR 158';
  public text: string =
    'Draw 2 cards. If your Active Pokémon has "Hisuian" in its name, draw 2 more cards. You may play only 1 Supporter card during your turn.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
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

      MOVE_CARDS(store, state, player.hand, player.supporter, { cards: [effect.trainerCard], sourceCard: this });

      // Draw 2 cards
      DRAW_CARDS(store, state, player, 2);

      // If active Pokemon has "Hisuian" in its name, draw 2 more
      const activePokemon = player.active.getPokemonCard();
      if (activePokemon && activePokemon.name.includes('Hisuian')) {
        DRAW_CARDS(store, state, player, 2);
      }
    }

    return state;
  }
}
