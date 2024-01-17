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
      if (filter.searchValue !== '' && card.name.indexOf(filter.searchValue) === -1) {
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

      

      if (filter.formats.length && !filter.formats.includes(this.getFormat(card))) {
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

    private getFormat(card: PokemonCard | TrainerCard | Card): Format {
    if (card.regulationMark === 'E' || card.regulationMark === 'F' || card.regulationMark === 'G') {
    return Format.STANDARD;
    }
    if (card.set === '151' || card.set === 'ASR' || card.set === 'BRS' || card.set === 'BST' || card.set === 'CEL' || card.set === 'CRE' || card.set === 'EVS' || card.set === 'FST' || card.set === 'LOR' || card.set === 'OBF' || card.set === 'PAL' || card.set === 'PAR' || card.set === 'PGO' || card.set === 'SIT' || card.set === 'SVE' || card.set === 'SVI' || card.set === 'BKP' || card.set === 'BLW' || card.set === 'BND' || card.set === 'BRC' || card.set === 'BRT' || card.set === 'BWP' || card.set === 'CL' || card.set === 'CLS' || card.set === 'COL' || card.set === 'CR' || card.set === 'DCR' || card.set === 'DEX' || card.set === 'DP' || card.set === 'DRX' || card.set === 'DS' || card.set === 'DSK' || card.set === 'EM' || card.set === 'EP' || card.set === 'EPO' || card.set === 'EX' || card.set === 'FCO' || card.set === 'FLF' || card.set === 'FUF' || card.set === 'GRI' || card.set === 'HGSS' || card.set === 'HS' || card.set === 'LT' || card.set === 'LTR' || card.set === 'MA' || card.set === 'MCD' || card.set === 'MD' || card.set === 'MMA' || card.set === 'NVI' || card.set === 'NXD' || card.set === 'PL' || card.set === 'PLB' || card.set === 'PLF' || card.set === 'PLS' || card.set === 'POP' || card.set === 'PR' || card.set === 'PS' || card.set === 'PV' || card.set === 'RR' || card.set === 'RS' || card.set === 'SM' || card.set === 'SS' || card.set === 'SV' || card.set === 'SW' || card.set === 'TM' || card.set === 'TR' || card.set === 'TRR' || card.set === 'UL' || card.set === 'UNB' || card.set === 'UPR') {
    return Format.EXPANDED;
    }
    if (card.set === 'BS') {
      return Format.RETRO;
      }
    }

/* private getFormat(card: PokemonCard | TrainerCard | Card): Format {

  const standardSets = [ 'E', 'F', 'G' ];

  const expandedSets = ['151', 'PLS'];

  const expandedSets2 = ['E', 'F'];

  const retroSets = [ ];

  if (standardSets.includes(card.regulationMark)) {
    return Format.STANDARD;
  }
  if (!expandedSets.includes(card.regulationMark)) {
      return Format.EXPANDED;
  }
  if (retroSets.includes(card.set)) {
    return Format.RETRO;
  }
}
 */

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