import { TrainerType, SuperType } from '../../../game/store/card/card-types';
import {
  StoreLike,
  State,
  GameError,
  GameMessage,
  PokemonCard,
  TrainerCard,
  Player,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class AetherFoundationEmployee extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '168';
  public name: string = 'Aether Foundation Employee';
  public fullName: string = 'Aether Foundation Employee LOT';
  public text: string =
    'Put 3 Pok\u00e9mon that have "Alolan" in their names from your discard pile into your hand. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return player.discard.cards.some((c) => c instanceof PokemonCard && c.name.includes('Alolan'));
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      const blocked: number[] = [];
      let alolanCount = 0;
      player.discard.cards.forEach((c, index) => {
        if (c instanceof PokemonCard && c.name.includes('Alolan')) {
          alolanCount++;
        } else {
          blocked.push(index);
        }
      });

      if (alolanCount === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        { superType: SuperType.POKEMON },
        { min: 1, max: Math.min(3, alolanCount), allowCancel: false, blocked },
      );
    }

    return state;
  }
}
