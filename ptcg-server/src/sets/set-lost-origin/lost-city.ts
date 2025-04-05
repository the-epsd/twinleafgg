import { TrainerType, CardTag } from '../../game/store/card/card-types';
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
    if (effect instanceof KnockOutEffect) {
      const card = effect.target.getPokemonCard();
      if (card !== undefined && !card.tags.includes(CardTag.PRISM_STAR)) {
        // Don't prevent default behavior yet - let other cards handle the knockout first
        // We'll handle moving to lost zone in the game reducer
        effect.target.marker.addMarker(this.LOST_CITY_MARKER, this);
      }
    }
    return state;
  }

  // const player = effect.player;
  // const target = effect.target;
  // const cards = target.getPokemons();

  // const attachedCards = new CardList();
  // const lostZoned = new CardList();

  // const pokemonIndices = effect.target.cards.map((card, index) => index);

  // for (let i = pokemonIndices.length - 1; i >= 0; i--) {
  //   const removedCard = target.cards.splice(pokemonIndices[i], 1)[0];
  //   if (removedCard.superType === SuperType.POKEMON) {
  //     lostZoned.cards.push(removedCard);
  //   } else {
  //     attachedCards.cards.push(removedCard);
  //   }
  //   target.damage = 0;
  // }

  // if (cards.some(card => card.tags.includes(CardTag.POKEMON_EX) || card.tags.includes(CardTag.POKEMON_V) || card.tags.includes(CardTag.POKEMON_VSTAR) || card.tags.includes(CardTag.POKEMON_ex))) {
  //   effect.prizeCount += 1;
  // }
  // if (cards.some(card => card.tags.includes(CardTag.POKEMON_VMAX))) {
  //   effect.prizeCount += 2;
  // }

  // lostZoned.moveTo(player.lostzone);
  // attachedCards.moveTo(player.discard);
}