import { CardList, StateUtils } from '../../game';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class LostCity extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public regulationMark = 'F';

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '161';

  public name: string = 'Lost City';

  public fullName: string = 'Lost City LOR';

  public text: string =
    'Whenever a Pokémon (either yours or your opponent\'s) is Knocked Out, put that Pokémon in the Lost Zone instead of the discard pile. (Discard all attached cards.)';

  public readonly LOST_CITY_MARKER = 'LOST_CITY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof KnockOutEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
  
      const target = effect.target;
      const cards = target.getPokemons();
      
      const removedCards = [];

      const pokemonIndices = effect.target.cards.map((card, index) => index);
      
      for (let i = pokemonIndices.length - 1; i >= 0; i--) {
        const removedCard = target.cards.splice(pokemonIndices[i], 1)[0];
        removedCards.push(removedCard);
        target.damage = 0;
      }

      if (cards.some(card => card.tags.includes(CardTag.POKEMON_EX) || card.tags.includes(CardTag.POKEMON_V) || card.tags.includes(CardTag.POKEMON_VSTAR) || card.tags.includes(CardTag.POKEMON_ex))) {
        effect.prizeCount += 1;
      }
      if (cards.some(card => card.tags.includes(CardTag.POKEMON_VMAX))) {
        effect.prizeCount += 2;
      }

      const attachedCards = new CardList();
      attachedCards.cards = removedCards;

      const lostZoned = new CardList();
      lostZoned.cards = cards;

      lostZoned.moveTo(player.lostzone);
      attachedCards.moveTo(player.discard);
    }
    
    return state;
  }
  
}
  