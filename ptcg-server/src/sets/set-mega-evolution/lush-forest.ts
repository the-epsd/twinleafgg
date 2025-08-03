import { PlayerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class LushForest extends TrainerCard {
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public trainerType = TrainerType.STADIUM;
  public set = 'M1S';
  public name = 'Lush Forest';
  public fullName = 'Lush Forest M1S';
  public regulationMark = 'I';
  public text = 'Each player\'s [G] Pokémon can evolve into another [G] Pokémon during the turn they play those Pokémon. (Players can\'t evolve a Pokémon during their first turn.)';

  reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
      if (state.turn > 2) {
        if (effect.pokemonCard.cardType === CardType.GRASS) {
          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
            const checkPokemonTypeEffect = new CheckPokemonTypeEffect(cardList);
            store.reduceEffect(state, checkPokemonTypeEffect);

            if (checkPokemonTypeEffect.cardTypes.includes(CardType.GRASS)) {
              cardList.pokemonPlayedTurn = state.turn - 1;
            }
          });
        }
      }
    }

    return state;
  }

}