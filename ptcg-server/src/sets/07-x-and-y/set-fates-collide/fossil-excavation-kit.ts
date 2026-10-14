import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player } from '../../../game';
import { MOVE_CARDS, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

const FOSSIL_NAMES = ['Helix Fossil Omanyte', 'Dome Fossil Kabuto', 'Old Amber Aerodactyl'];

export class FossilExcavationKit extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'FCO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';
  public name: string = 'Fossil Excavation Kit';
  public fullName: string = 'Fossil Excavation Kit FCO';
  public text: string =
    'Put 2 in any combination of Helix Fossil Omanyte, Dome Fossil Kabuto, or Old Amber Aerodactyl cards from your discard pile into your hand.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (!player.discard.cards.some((c) => FOSSIL_NAMES.includes(c.name))) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      const fossilCount = player.discard.cards.filter((c) => FOSSIL_NAMES.includes(c.name)).length;

      if (fossilCount === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      // Discard pile is public knowledge, so enforce exact count when possible
      const max = Math.min(2, fossilCount);

      // Block non-fossil cards
      const blocked: number[] = [];
      player.discard.cards.forEach((card, index) => {
        if (!FOSSIL_NAMES.includes(card.name)) {
          blocked.push(index);
        }
      });

      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        {},
        { min: max, max, allowCancel: false, blocked },
      );
    }

    return state;
  }
}
