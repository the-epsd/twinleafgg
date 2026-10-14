import { GameMessage } from '../../../game/game-message';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, SuperType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { GameError, Player } from '../../../game';
import { SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class RescueCarrier extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'E';
  public set: string = 'EVS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '154';
  public name: string = 'Rescue Carrier';
  public fullName: string = 'Rescue Carrier EVS';
  public text: string =
    'Put up to 2 Pokémon, each with 90 HP or less, from your discard pile into your hand.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const blocked: number[] = [];
    player.discard.cards.forEach((card, index) => {
      if (card instanceof PokemonCard && card.hp > 90) {
        blocked.push(index);
      }
    });

    if (blocked.length === player.discard.cards.length) {
      return false;
    }

    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      const blocked: number[] = [];
      player.discard.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.hp > 90) {
          blocked.push(index);
        }
      });

      if (blocked.length === player.discard.cards.length) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        { superType: SuperType.POKEMON },
        { min: 1, max: 2, allowCancel: false, blocked },
      );
    }

    return state;
  }
}
