import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { PowerEffect, UseStadiumEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

export class PathToThePeak extends TrainerCard {
  public trainerType = TrainerType.STADIUM;
  public set = 'CRE';
  public set2: string = 'chillingreign';
  public setNumber: string = '148';
  public regulationMark = 'E';
  public name = 'Path to the Peak';
  public fullName = 'Path to the Peak CRE';
  public text = 'Pokémon with a Rule Box in play (both yours and your opponent\'s) have no Abilities. (Pokémon V, Pokémon-GX, etc. have Rule Boxes.)';
    
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && StateUtils.getStadiumCard(state) === this) {
      const pokemonCard = effect.card;
      
      if (pokemonCard.tags.includes(CardTag.POKEMON_V || CardTag.POKEMON_GX || CardTag.POKEMON_VMAX || CardTag.POKEMON_EX || CardTag.POKEMON_VSTAR || CardTag.RADIANT || CardTag.POKEMON_ex)) {
        pokemonCard.powers = [];
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      return state;
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
