import { Pipe, PipeTransform } from '@angular/core';

import { DeckEditToolbarFilter } from './deck-edit-toolbar-filter.interface';
import { Card, CardType, SuperType, PokemonCard, EnergyCard, CardTag, Format, TrainerCard, Stage } from 'ptcg-server';
import { LibraryItem } from '../deck-card/deck-card.interface';
import { FormatValidator } from 'src/app/util/formats-validator';

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

      // if (filter.superTypes.includes(SuperType.POKEMON) && 
      //    ((filter.hasAbility && (card as PokemonCard).powers?.length === 0) || 
      //    (!filter.hasAbility && (card as PokemonCard).powers?.length > 0))) {
      //   return false
      // }

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

      if (filter.tags.length && !filter.tags.some((tag) => card.tags.includes(tag))) {
        return false;
      }

      if (filter.formats.length && !filter.formats.some(f => this.getFormats(card).includes(f))) {
        return false;
      }

      return true;
    });
  }

  private matchCardText(card: Card, searchValue: string) {

    function searchCleanse(value: string): string {
      return value.toLocaleLowerCase().replace('é', 'e');
    }

    const search = searchCleanse(searchValue);
    const cardName = searchCleanse(card.name);
    const setNumber = searchCleanse(card.setNumber);
    const set = searchCleanse(card.set);

    if (cardName.includes(search) || setNumber.includes(search) || set.includes(search))
      return true;

    const trainerCard = card as TrainerCard;
    if (trainerCard.text !== undefined) {
      const trainerText = searchCleanse(trainerCard.text);
      if (trainerText.includes(search))
        return true;
    }

    const energyCard = card as EnergyCard;
    if (energyCard.text !== undefined) {
      const energyText = searchCleanse(energyCard.text);
      if (energyText.includes(search))
        return true;
    }

    if (card.attacks.length > 0) {
      const attackNames = card.attacks.map(attack => searchCleanse(attack.name));
      const attackTexts = card.attacks.map(attack => searchCleanse(attack.text));
      if (attackNames.some(n => (n.includes(search))) || attackTexts.some(n => (n.includes(search))))
        return true;
    }
    if (card.powers.length > 0) {
      const powerNames = card.powers.map(power => searchCleanse(power.name));
      const powerTexts = card.powers.map(power => searchCleanse(power.text));
      if (powerNames.some(n => (n.includes(search))) || powerTexts.some(n => (n.includes(search))))
        return true;
    }
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

  private getFormats(card: PokemonCard | TrainerCard | Card): Format[] {
    return FormatValidator.getValidFormats(card);
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