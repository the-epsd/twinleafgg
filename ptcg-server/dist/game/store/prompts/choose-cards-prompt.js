import { CardType, EnergyType, SuperType, TrainerType } from '../card/card-types';
import { Prompt } from './prompt';
export const ChooseCardsPromptType = 'Choose cards';
export class ChooseCardsPrompt extends Prompt {
    constructor(player, message, cards, filter, options) {
        super(player.id);
        this.message = message;
        this.cards = cards;
        this.filter = filter;
        this.type = ChooseCardsPromptType;
        this.blockedCardNames = [];
        this.player = player;
        // Default options
        this.options = Object.assign({}, {
            min: 0,
            max: cards.cards.length,
            allowCancel: true,
            blocked: [],
            isSecret: false,
            differentTypes: false,
            allowDifferentSuperTypes: true,
            maxPokemons: undefined,
            maxBasicEnergies: undefined,
            maxEnergies: undefined,
            maxTrainers: undefined,
            maxTools: undefined,
            maxStadiums: undefined,
            maxSupporters: undefined,
            maxSpecialEnergies: undefined,
            maxItems: undefined,
        }, options);
        if (this.options.blocked.length > 0) {
            for (let i = 0; i < this.cards.cards.length; i++) {
                if (this.options.blocked.indexOf(i) !== -1) {
                    if (this.blockedCardNames.indexOf(this.cards.cards[i].name) === -1) {
                        this.blockedCardNames.push(this.cards.cards[i].name);
                    }
                }
            }
        }
        if (!this.options.isSecret) {
            if (this.cards === this.player.deck || this.cards === this.player.discard) {
                this.cards.sort();
            }
        }
        if (this.options.blocked.length > 0) {
            this.options.blocked = [];
            this.cards.cards.forEach((card, index) => {
                if (this.blockedCardNames.indexOf(card.name) !== -1) {
                    this.options.blocked.push(index);
                }
            });
        }
    }
    decode(result) {
        if (result === null) {
            return null;
        }
        const cards = this.cards.cards;
        return result.map(index => cards[index]);
    }
    validate(result) {
        if (result === null) {
            return this.options.allowCancel;
        }
        if (result.length < this.options.min || result.length > this.options.max) {
            return false;
        }
        if (!this.options.allowDifferentSuperTypes) {
            const set = new Set(result.map(r => r.superType));
            if (set.size > 1) {
                return false;
            }
        }
        // Check if 'different types' restriction is valid
        if (this.options.differentTypes) {
            const typeMap = {};
            for (const card of result) {
                const cardType = ChooseCardsPrompt.getCardType(card);
                if (typeMap[cardType] === true) {
                    return false;
                }
                else {
                    typeMap[cardType] = true;
                }
            }
        }
        // Check if 'max' restrictions are valid
        const countMap = {};
        for (const card of result) {
            const count = countMap[card.superType.toString()] || 0;
            countMap[card.superType.toString()] = count + 1;
            if (card.superType === SuperType.TRAINER) {
                const trainerTypeCount = countMap[`${card.superType}-${card.trainerType}`] || 0;
                countMap[`${card.superType}-${card.trainerType}`] = trainerTypeCount + 1;
            }
            if (card.superType === SuperType.ENERGY) {
                const energyTypeCount = countMap[`${card.superType}-${card.energyType}`] || 0;
                countMap[`${card.superType}-${card.energyType}`] = energyTypeCount + 1;
            }
        }
        const { maxPokemons, maxBasicEnergies, maxTrainers, maxItems, maxTools, maxStadiums, maxSupporters, maxSpecialEnergies, maxEnergies } = this.options;
        if ((maxPokemons !== undefined && maxPokemons < countMap[`${SuperType.POKEMON}`])
            || (maxBasicEnergies !== undefined && maxBasicEnergies < countMap[`${SuperType.ENERGY}-${EnergyType.BASIC}`])
            || (maxEnergies !== undefined && maxEnergies < countMap[`${SuperType.ENERGY}`])
            || (maxTrainers !== undefined && maxTrainers < countMap[`${SuperType.TRAINER}-${SuperType.TRAINER}`])
            || (maxItems !== undefined && maxItems < countMap[`${SuperType.TRAINER}-${TrainerType.ITEM}`])
            || (maxStadiums !== undefined && maxStadiums < countMap[`${SuperType.TRAINER}-${TrainerType.STADIUM}`])
            || (maxSupporters !== undefined && maxSupporters < countMap[`${SuperType.TRAINER}-${TrainerType.SUPPORTER}`])
            || (maxSpecialEnergies !== undefined && maxSpecialEnergies < countMap[`${SuperType.ENERGY}-${EnergyType.SPECIAL}`])
            || (maxTools !== undefined && maxTools < countMap[`${SuperType.TRAINER}-${TrainerType.TOOL}`])) {
            return false;
        }
        const blocked = this.options.blocked;
        return result.every(r => {
            const index = this.cards.cards.indexOf(r);
            return index !== -1 && !blocked.includes(index) && this.matchesFilter(r);
        });
    }
    static getCardType(card) {
        if (card.superType === SuperType.ENERGY) {
            const energyCard = card;
            return energyCard.provides.length > 0 ? energyCard.provides[0] : CardType.NONE;
        }
        if (card.superType === SuperType.POKEMON) {
            const pokemonCard = card;
            return pokemonCard.cardType;
        }
        return CardType.NONE;
    }
    matchesFilter(card) {
        for (const key in this.filter) {
            if (Object.prototype.hasOwnProperty.call(this.filter, key)) {
                if (this.filter[key] !== card[key]) {
                    return false;
                }
            }
        }
        return true;
    }
}
