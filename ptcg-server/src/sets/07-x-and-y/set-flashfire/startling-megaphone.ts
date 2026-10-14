import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, PlayerType, StateUtils, PokemonCardList } from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class StartlingMegaphone extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'FLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '97';
  public name: string = 'Startling Megaphone';
  public fullName: string = 'Startling Megaphone FLF';
  public text: string = "Discard all Pokemon Tool cards attached to each of your opponent's Pokemon.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);
    let hasTool = false;
    opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
      if (cardList.tools.length > 0) {
        hasTool = true;
      }
    });
    return hasTool;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const pokemonsWithTool: PokemonCardList[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        if (cardList.tools.length > 0) {
          pokemonsWithTool.push(cardList);
        }
      });

      if (pokemonsWithTool.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      pokemonsWithTool.forEach((target) => {
        for (const tool of [...target.tools]) {
          MOVE_CARDS(store, state, target, opponent.discard, { cards: [tool], sourceCard: this });
        }
      });
    }

    return state;
  }
}
