import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, Stage } from '../../game/store/card/card-types';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { PlayerType } from '../../game';

export class ExcitingStadium extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public regulationMark = 'H';

  public set: string = 'SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '180';

  public name: string = 'Lively Stadium';

  public fullName: string = 'Exciting Stadium SV8';

  public text: string =
    'Basic Pokémon in play get +30 HP.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckHpEffect && StateUtils.getStadiumCard(state) === this) {
      if (effect instanceof CheckHpEffect && StateUtils.getStadiumCard(state) === this) {
        const player = effect.player;
        const opponent = StateUtils.getOpponent(state, player);
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
          const pokemonCard = cardList.getPokemonCard();
          if (pokemonCard && pokemonCard.stage === Stage.BASIC) {
            effect.hp += 30;
          }
        });
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          const pokemonCard = cardList.getPokemonCard();
          if (pokemonCard && pokemonCard.stage === Stage.BASIC) {
            effect.hp += 30;
          }
        });
      }

      if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
        throw new GameError(GameMessage.CANNOT_USE_STADIUM);
      }
    }
    return state;
  }
}