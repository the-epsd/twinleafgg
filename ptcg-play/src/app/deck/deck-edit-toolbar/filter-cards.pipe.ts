import { Pipe, PipeTransform } from '@angular/core';

import { DeckEditToolbarFilter } from './deck-edit-toolbar-filter.interface';
import { Card, CardType, SuperType, PokemonCard, EnergyCard, CardTag, Format, TrainerCard, Stage } from 'ptcg-server';
import { LibraryItem } from '../deck-card/deck-card.interface';

@Pipe({
  name: 'filterCards'
})
export class FilterCardsPipe implements PipeTransform {

  transform(items: LibraryItem[], filter: DeckEditToolbarFilter): any {

    if (filter === undefined) {
      return items;
    }

    if (!filter.searchValue
      && filter.superTypes.length === 0
      && filter.stages.length === 0
      && filter.cardTypes.length === 0
      && filter.energyTypes.length === 0
      && filter.trainerTypes.length === 0
      && filter.tags.length === 0
      && filter.attackCosts.length === 0
      && filter.retreatCosts.length === 0
      && filter.formats.length === 0) {
      return items;
    }

    return items.filter(item => {
      const card = item.card;
      if (!!filter.searchValue && !this.matchCardText(card, filter.searchValue)) {
        return false;
    }

      if (filter.superTypes.length && !filter.superTypes.includes(card.superType)) {
        return false;
      }
      
      if (filter.superTypes.includes(SuperType.POKEMON) && 
         ((filter.hasAbility && (card as PokemonCard).powers?.length === 0) || 
         (!filter.hasAbility && (card as PokemonCard).powers?.length > 0))) {
        return false
      }
      
      if (filter.stages.length && !filter.stages.includes((card as PokemonCard).stage)) {
        return false;
      }
      
      if (filter.energyTypes.length && !filter.energyTypes.includes((card as EnergyCard).energyType)) {
        return false;
      }
      
      if (filter.trainerTypes.length && !filter.trainerTypes.includes((card as TrainerCard).trainerType)) {
        return false;
      }
      
      if (filter.retreatCosts.length && !this.matchRetreatCosts(filter.retreatCosts, card)) {
        return false;
      }
      
      if (filter.attackCosts.length && !this.matchAttackCosts(filter.attackCosts, card)) {
        return false;
      }

      if (filter.cardTypes.length && (!filter.cardTypes.includes(this.getCardType(card)) && !filter.cardTypes.includes(CardType.ANY))) {
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
  
  private matchCardText(card: Card, searchValue: string) {
    const lowerCaseSearchValue = searchValue.toLocaleLowerCase();
    if (card.name.toLocaleLowerCase().includes(lowerCaseSearchValue))
      return true;
    
    if (card.setNumber.toLocaleLowerCase().includes(lowerCaseSearchValue))
      return true;
    
    if (card.set.toLocaleLowerCase().includes(lowerCaseSearchValue))
      return true;
    
    const pokemonCard = card as PokemonCard;
    if (pokemonCard.attacks?.some(a => a.name.toLocaleLowerCase().includes(lowerCaseSearchValue)))
      return true;
    
    if (pokemonCard.attacks?.some(a => a.text.toLocaleLowerCase().includes(lowerCaseSearchValue)))
      return true;
  
    const trainerCard = card as TrainerCard;
    if (trainerCard.text?.toLocaleLowerCase().includes(lowerCaseSearchValue))
      return true;
    
    const energyCard = card as EnergyCard;
    if (energyCard.text?.toLocaleLowerCase().includes(lowerCaseSearchValue))
      return true;
  }
  
  private matchRetreatCosts(retreatCosts: number[], card: Card): boolean {
    const pokemonCard = card as PokemonCard;
    
    if (pokemonCard.retreat === undefined) return false;
    
    const retreat = pokemonCard.retreat;
    
    if (retreatCosts.includes(0) && !card.retreat.length) {
      return true;
    }
    
    return retreatCosts.includes(retreat.length);
  }
  
  private matchAttackCosts(attackCosts: number[], card: Card): boolean {
    const pokemonCard = card as PokemonCard;
    
    if (pokemonCard.attacks === undefined) return false;    
    
    const attacks = pokemonCard.attacks;
    
    if (attackCosts.includes(0) && attacks.map(a => a.cost.length).filter(c => c === 0).length >= 1) {
      return true;
    }
    
    return attackCosts.some(c => attacks.map(a => a.cost.length).includes(c));
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

  //   {
  //     // BASE-GYM
  //     'BS'; new Date('09-01-1999'),
  //     'JU'; new Date('16-06-1999'),
  //     'FO'; new Date('10-10-1999'),
  //     'TR'; new Date('24-04-2000'),
  //     'G1'; new Date('14-08-2000'),
  //     'G2'; new Date('16-10-2000')
  //   }
    
  //   {
  //     // NEO
  //     'N1'; new Date('16-12-2000'),
  //     'N2'; new Date('01-06-2001'),
  //     'N3'; new Date('21-09-2001'),
  //     'N4'; new Date('28-02-2002')
  //   }
    
  //   {
  //     // LEGENDARY COLLECTION
  //     'LC'; new Date('24-05-2002')
  //   }
    
  //   {
  //     // E-CARD
  //     'EX'; new Date('15-09-2002'),
  //     'AQ'; new Date('15-01-2003'),
  //     'SK'; new Date('12-05-2003')
  //   }
    
  //   {
  //     // EX 
  //     'RS'; new Date('18-07-2003'),
  //     'SS'; new Date('18-09-2003'),
  //     'DR'; new Date('24-11-2003'),
  //     'MA'; new Date('15-03-2004'),
  //     'HL'; new Date('14-06-2004'),
  //     'FL'; new Date('30-08-2004'),
  //     'TRR'; new Date('08-11-2004'),
  //     'DX'; new Date('14-02-2005'),
  //     'EM'; new Date('09-05-2005'),
  //     'UF'; new Date('22-08-2005'),
  //     'DS'; new Date('31-10-2005'),
  //     'LM'; new Date('13-02-2006'),
  //     'HP'; new Date('03-05-2006'),
  //     'CG'; new Date('30-08-2006'),
  //     'DF'; new Date('08-11-2006'),
  //     'PK'; new Date('14-02-2007')
  //   }
    
  //   {
  //     // DIAMOND & PEARL
  //     'DP'; new Date('23-05-2007'),
  //     'MT'; new Date('22-08-2007'),
  //     'SW'; new Date('07-11-2007'),
  //     'GE'; new Date('13-02-2008'),
  //     'MD'; new Date('21-05-2008'),
  //     'LA'; new Date('20-08-2008'),
  //     'SF'; new Date('05-11-2008')
  //   }
    
  //   {
  //     //PLATINUM
  //     'PL'; new Date('11-02-2009'),
  //     'RR'; new Date('16-05-2009'),
  //     'SV'; new Date('19-08-2009'),
  //     'AR'; new Date('04-11-2009')
  //   }
    
  //   {
  //     // HG & SS
  //     'HS'; new Date('10-02-2010'),
  //     'UL'; new Date('12-05-2010'),
  //     'UD'; new Date('18-08-2010'),
  //     'TM'; new Date('03-11-2010')
  //   }
    
  //   {
  //     // CALL OF LEGENDS
  //     'CL'; new Date('09-02-2011')
  //   }
    
  //   {
  //     // BLACK & WHITE
  //     'BLW'; new Date('25-04-2011'),
  //     'EPO'; new Date('31-08-2011'),
  //     'NVI'; new Date('16-11-2011'),
  //     'NXD'; new Date('08-02-2012'),
  //     'DEX'; new Date('09-05-2012'),
  //     'DRX'; new Date('15-08-2012'),
  //     'DRV'; new Date('05-10-2012'),
  //     'BCR'; new Date('07-11-2012'),
  //     'PLS'; new Date('06-02-2013'),
  //     'PLF'; new Date('08-05-2013'),
  //     'PLB'; new Date('14-08-2013'),
  //     'LTR'; new Date('06-11-2013')
  //   }
    
  //   {
  //     // X & Y
  //     'KSS'; new Date('08-11-2013'),
  //     'XY'; new Date('05-02-2014'),
  //     'FLF'; new Date('07-05-2014'),
  //     'FFI'; new Date('13-08-2014'),
  //     'PHF'; new Date('05-11-2014'),
  //     'PRC'; new Date('04-02-2015'),
  //     'DCR'; new Date('25-03-2015'),
  //     'ROS'; new Date('06-05-2015'),
  //     'AOR'; new Date('12-08-2015'),
  //     'BKT'; new Date('04-11-2015'),
  //     'BKP'; new Date('03-02-2016'),
  //     'GEN'; new Date('22-02-2016'),
  //     'FCO'; new Date('02-05-2016'),
  //     'STS'; new Date('03-08-2016'),
  //     'EVO'; new Date('02-11-2016')
  //   }
  
  // {
  //   // SUN & MOON
  //   'SUM'; new Date('03-02-2017'),
  //   'GRI'; new Date('05-05-2017'),
  //   'BUS'; new Date('04-08-2017'),
  //   'SLG'; new Date('06-10-2017'),
  //   'CIN'; new Date('03-11-2017'),
  //   'UPR'; new Date('02-02-2018'),
  //   'FLI'; new Date('05-04-2018'),
  //   'CES'; new Date('08-03-2018'),
  //   'DRM'; new Date('09-07-2018'),
  //   'LOT'; new Date('11-02-2018'),
  //   'TEU'; new Date('02-01-2019'),
  //   'DET'; new Date('29-03-2019'),
  //   'UNB'; new Date('05-03-2019'),
  //   'UNM'; new Date('08-02-2019'),
  //   'HIF'; new Date('23-08-2019'),
  //   'CEC'; new Date('11-01-2019')
  // }
  
  // {
  //   // SWORD & SHIELD
  //   'SSH'; new Date('07-02-2020'),
  //   'RCL'; new Date('01-05-2020'),
  //   'DAA'; new Date('14-08-2020'),
  //   'CPA'; new Date('25-09-2020'),
  //   'VIV'; new Date('13-11-2020'),
  //   'SHF'; new Date('19-02-2021'),
  //   'BST'; new Date('19-03-2021'),
  //   'CRE'; new Date('18-06-2021'),
  //   'EVS'; new Date('27-08-2021'),
  //   'CEL'; new Date('08-10-2021'),
  //   'FST'; new Date('12-11-2021'),
  //   'BRS'; new Date('25-02-2022'),
  //   'ASR'; new Date('27-05-2022'),
  //   'PGO'; new Date('01-07-2022'),
  //   'LOR'; new Date('09-09-2022'),
  //   'SIT'; new Date('11-11-2022'),
  //   'CRZ'; new Date('20-01-2023')
  // }
  
  // {
  //   // SCARLET & VIOLET
  //   'SVI'; new Date('31-03-2023'),
  //   'PAL'; new Date('09-06-2023'),
  //   'OBF'; new Date('11-08-2023'),
  //   'MEW'; new Date('22-09-2023'),
  //   'PAR'; new Date('03-11-2023'),
  //   'PAF'; new Date('26-01-2024'),
  //   'TEF'; new Date('22-03-2024')
  // }
  
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