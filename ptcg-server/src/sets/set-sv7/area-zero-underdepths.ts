import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';

export class AreaZeroUnderdepths extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'SV6a';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '56';

  public regulationMark = 'H';

  public name: string = 'Area Zero Underdepths';

  public fullName: string = 'Area Zero Underdepths SV6a';

  public text =
    'Players with a Tera Pokémon in play may have up to 8 Benched Pokémon.'+
    ''+
    '(If this card gets discarded, or if a player has no Tera Pokémon in play anymore, they discard Benched Pokémon until they have 5. If both players discard, this card\'s owner chooses first)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckTableStateEffect && StateUtils.getStadiumCard(state) === this) {
      effect.benchSizes = state.players.map((player, index) => {
        let pokemonV = 0;
        if (player.active?.getPokemonCard()?.tags.includes(CardTag.POKEMON_TERA)) {
          pokemonV++;
        }

        player.bench.forEach(benchSpot => {
          if (benchSpot.getPokemonCard()?.tags.includes(CardTag.POKEMON_TERA)) {
            pokemonV++;
          }
        });
        return pokemonV >= 1 ? 8 : 5;
      });

      if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
        throw new GameError(GameMessage.CANNOT_USE_STADIUM);
      }
    }
    return state;
  }
}