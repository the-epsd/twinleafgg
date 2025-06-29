import { PlayerType, State, StateUtils, StoreLike } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class BrokenTimeSpace extends TrainerCard {
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '104';
  public trainerType = TrainerType.STADIUM;
  public set = 'PL';
  public name = 'Broken Time-Space';
  public fullName = 'Broken Time-Space PL';

  public text = 'Each player may evolve a Pokémon that he or she just played or evolved during that turn.';

  reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
      player.canEvolve = true;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        cardList.pokemonPlayedTurn = state.turn - 1;
      });
    }

    return state;
  }

}