import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { PlayerType, StateUtils, GameError, GameMessage, PokemonCardList } from '../../game';


export class StartlingMegaphone extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'FLF';

  public name: string = 'Startling Megaphone';

  public fullName: string = 'Startling Megaphone FLF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '97';

  public text: string =
    'Discard all Pokemon Tool cards attached to each of your ' +
    'opponent\'s Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const pokemonsWithTool: PokemonCardList[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.tools.length > 0) {
          pokemonsWithTool.push(cardList);
        }
      });

      if (pokemonsWithTool.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      pokemonsWithTool.forEach(target => {
        if (target.tools.length > 0) {
          for (const tool of [...target.tools]) {
            target.moveCardTo(tool, opponent.discard);
          }
        }
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
      });
    }

    return state;
  }

}
