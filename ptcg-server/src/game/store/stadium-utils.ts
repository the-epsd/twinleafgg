import { CardTag, SuperType } from './card/card-types';
import { CardList } from './state/card-list';
import { Player } from './state/player';

/**
 * Remove a stadium CardList from play.
 * Pokémon used as Stadium (e.g. Dusknoir LV.X Ectoplasm) return to hand;
 * Prism Star cards go to the Lost Zone; everything else is discarded.
 */
export function REMOVE_STADIUM_CARD_LIST(cardList: CardList, owner: Player): void {
  const stadiumCard = cardList.cards[0];
  if (stadiumCard === undefined) {
    return;
  }
  if (stadiumCard.superType === SuperType.POKEMON) {
    cardList.moveTo(owner.hand);
    return;
  }
  if (stadiumCard.tags.includes(CardTag.PRISM_STAR)) {
    cardList.moveTo(owner.lostzone);
    return;
  }
  cardList.moveTo(owner.discard);
}
