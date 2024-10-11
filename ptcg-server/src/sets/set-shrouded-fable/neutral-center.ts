import { StateUtils } from '../../game/store/state-utils';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class NeutralCenter extends TrainerCard {

  public trainerType = TrainerType.STADIUM;

  public tags = [CardTag.ACE_SPEC];

  public set = 'SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '60';

  public regulationMark = 'H';

  public name = 'Neutralization Zone';

  public fullName = 'Neutral Center SFA';

  public text = 'Pokémon that don\'t have a Rule Box don\'t take any damage from attacks from their opponent\'s Pokémon ex and Pokémon V.' +
    '' +
    'If this card is in your discard pile, it can\'t be put into your hand or put back into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Prevent damage from Pokemon V and ex
    if (effect instanceof PutDamageEffect && StateUtils.getStadiumCard(state) === this) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      // Do not ignore self-damage from Pokemon-Ex
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.findOwner(state, effect.source);

      if (player === opponent) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const nonRuleBox = pokemonCard && !pokemonCard.tags.includes(CardTag.POKEMON_ex) && !pokemonCard.tags.includes(CardTag.POKEMON_V) && !pokemonCard.tags.includes(CardTag.POKEMON_VMAX) && !pokemonCard.tags.includes(CardTag.POKEMON_VSTAR);

      if (sourceCard && sourceCard.tags.includes(CardTag.POKEMON_V)) {
        if (nonRuleBox) {
          effect.preventDefault = true;
        } else {
          effect.preventDefault = false;
        }
      }

      if (sourceCard && sourceCard.tags.includes(CardTag.POKEMON_VSTAR)) {
        if (nonRuleBox) {
          effect.preventDefault = true;
        }
      } else {
        effect.preventDefault = false;
      }

      if (sourceCard && sourceCard.tags.includes(CardTag.POKEMON_VMAX)) {
        if (nonRuleBox) {
          effect.preventDefault = true;
        } else {
          effect.preventDefault = false;
        }
      }

      if (sourceCard && sourceCard.tags.includes(CardTag.POKEMON_ex)) {
        if (nonRuleBox) {
          effect.preventDefault = true;
        } else {
          effect.preventDefault = false;
        }
      }

      if (sourceCard && sourceCard.tags.includes(CardTag.RADIANT)) {
        if (nonRuleBox) {
          effect.preventDefault = true;
        } else {
          effect.preventDefault = false;
        }
      }

      if (sourceCard && sourceCard.tags.includes(CardTag.POKEMON_EX)) {
        if (nonRuleBox) {
          effect.preventDefault = true;
        } else {
          effect.preventDefault = false;
        }
      }

      if (sourceCard && sourceCard.tags.includes(CardTag.POKEMON_GX)) {
        if (nonRuleBox) {
          effect.preventDefault = true;
        } else {
          effect.preventDefault = false;
        }
      }

      if (sourceCard && sourceCard.tags.includes(CardTag.POKEMON_LV_X)) {
        if (nonRuleBox) {
          effect.preventDefault = true;
        } else {
          effect.preventDefault = false;
        }
      }

      return state;
    }
    return state;
  }
}
