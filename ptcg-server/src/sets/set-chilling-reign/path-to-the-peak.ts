import { StateUtils } from '../../game/store/state-utils';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { PowerEffect, UseStadiumEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameError, GameMessage } from '../../game';
import { checkState } from '../../game/store/effect-reducers/check-effect';

export class PathToThePeak extends TrainerCard {

  public trainerType = TrainerType.STADIUM;

  public set = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '148';

  public regulationMark = 'E';

  public name = 'Path to the Peak';

  public fullName = 'Path to the Peak CRE';
  
  public text = 'Pokémon with a Rule Box in play (both yours and your opponent\'s) have no Abilities. (Pokémon V, Pokémon-GX, etc. have Rule Boxes.)';
    
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && StateUtils.getStadiumCard(state) === this &&
        !effect.power.exemptFromAbilityLock) {

      const pokemonCard = effect.card;
      if (pokemonCard.tags.includes(CardTag.POKEMON_V) ||
        pokemonCard.tags.includes(CardTag.POKEMON_VMAX) ||
        pokemonCard.tags.includes(CardTag.POKEMON_VSTAR) ||
        pokemonCard.tags.includes(CardTag.POKEMON_ex) ||
        pokemonCard.tags.includes(CardTag.RADIANT)) {
        // pokemonCard.powers.length -= 1;
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
        throw new GameError(GameMessage.CANNOT_USE_STADIUM);
      }

      checkState(store, state);

      return state;
    }

    return state;
  }



}
