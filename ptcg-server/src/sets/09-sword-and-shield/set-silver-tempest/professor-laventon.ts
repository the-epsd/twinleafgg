import { TrainerType, SuperType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  TrainerCard,
  Player,
  StoreLike,
  State,
  GameError,
  GameMessage,
  PokemonCard,
} from '../../../game';
import {
  MOVE_CARDS,
  SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class ProfessorLaventon extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'F';
  public set: string = 'SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '162';
  public name: string = 'Professor Laventon';
  public fullName: string = 'Professor Laventon SIT 162';
  public text: string =
    'Put up to 3 Pokémon that have "Hisuian" in their names from your discard pile into your hand. You may play only 1 Supporter card during your turn.';

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

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      // Find Hisuian Pokemon in discard
      const hisuianInDiscard = player.discard.cards.filter(
        (c) => c instanceof PokemonCard && c.name.includes('Hisuian'),
      );

      if (hisuianInDiscard.length === 0) {
        return state;
      }

      const maxPick = Math.min(3, hisuianInDiscard.length);

      // Build blocked array for non-Hisuian Pokemon
      const blocked: number[] = [];
      player.discard.cards.forEach((c, index) => {
        const isHisuian = c instanceof PokemonCard && c.name.includes('Hisuian');
        if (!isHisuian) {
          blocked.push(index);
        }
      });

      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        { superType: SuperType.POKEMON },
        { min: 0, max: maxPick, allowCancel: false, blocked },
      );
    }

    return state;
  }
}
