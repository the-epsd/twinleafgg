import { Stage, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, StateUtils } from '../../../game';
import { DRAW_CARDS, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class LasssSpecial extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'FCO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '103';
  public name: string = "Lass's Special";
  public fullName: string = "Lass's Special FCO";
  public text: string =
    "Draw a card for each of your opponent's Benched Basic Pokémon. You may play only 1 Supporter card during your turn (before your attack).";

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

      // Count opponent's Benched Basic Pokemon
      const basicBenchedCount = opponent.bench.filter(
        (b) => b.cards.length > 0 && b.getPokemonCard()?.stage === Stage.BASIC,
      ).length;

      DRAW_CARDS(store, state, player, basicBenchedCount);
    }

    return state;
  }
}
