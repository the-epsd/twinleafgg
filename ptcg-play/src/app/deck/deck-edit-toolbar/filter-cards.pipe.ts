import { Pipe, PipeTransform } from '@angular/core';

import { DeckEditToolbarFilter } from './deck-edit-toolbar-filter.interface';
import { Card, CardType, SuperType, PokemonCard, EnergyCard, CardTag, Format, TrainerCard } from 'ptcg-server';
import { LibraryItem } from '../deck-card/deck-card.interface';

@Pipe({
  name: 'filterCards'
})
export class FilterCardsPipe implements PipeTransform {

  transform(items: LibraryItem[], filter: DeckEditToolbarFilter): any {

    if (filter === undefined) {
      return items;
    }

    if (filter.searchValue === ''
      && filter.superTypes.length === 0
      && filter.cardTypes.length === 0
      && filter.tags.length === 0
      && filter.formats.length === 0) {
      return items;
    }

    return items.filter(item => {
      const card = item.card;
      if (filter.searchValue !== '' && !card.name.toLocaleLowerCase().includes(filter.searchValue.toLocaleLowerCase())) {
        return false;
    }
    

      if (filter.superTypes.length && !filter.superTypes.includes(card.superType)) {
        return false;
      }

      if (filter.cardTypes.length && !filter.cardTypes.includes(this.getCardType(card))) {
        return false;
      }

      if (filter.tags.length && !filter.tags.includes(this.getTags(card))) {
        return false;
      }

      if (filter.formats.length && !filter.formats.some(f => this.getFormats(card).includes(f))) {
        return false;
      }

      return true;
    });
  }

  private getTags(card: Card): CardTag {
    if (card.tags.includes(CardTag.POKEMON_V)) {
      return CardTag.POKEMON_V;
    }
    if (card.tags.includes(CardTag.POKEMON_VSTAR)) {
      return CardTag.POKEMON_VSTAR;
    }
    if (card.tags.includes(CardTag.POKEMON_VMAX)) {
      return CardTag.POKEMON_VMAX;
    }
  }

  private getFormats(card: PokemonCard | TrainerCard | Card): Format[] {
    const formats: Format[] = [];
    formats.push(Format.UNLIMITED);

    if (card.regulationMark === 'ENERGY' || card.regulationMark === 'E' || card.regulationMark === 'F' || card.regulationMark === 'G' || card.regulationMark === 'H') {
      formats.push(Format.STANDARD);
    }

    if (card.regulationMark === 'ENERGY') {
      formats.push(Format.EXPANDED);
    }

    if (card.regulationMark === 'ENERGY' || card.set === 'BS' || card.set === 'JU' || card.set === 'FO' || card.set ==='PR') {
      formats.push(Format.RETRO);
    }

    return formats;
  }


  private getCardType(card: Card): CardType {
    if (card.superType === SuperType.POKEMON) {
      return (card as PokemonCard).cardType;
    }
    if (card.superType === SuperType.ENERGY) {
      const energyCard = card as EnergyCard;
      if (energyCard.provides.length > 0) {
        return energyCard.provides[0];
      }
    }
    return CardType.NONE;
  }

}