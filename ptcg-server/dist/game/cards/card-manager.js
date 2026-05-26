import { deepClone } from '../../utils/utils';
export class CardManager {
    constructor() {
        this.cards = [];
        this.cardIndex = {};
    }
    static getInstance() {
        if (!CardManager.instance) {
            CardManager.instance = new CardManager();
        }
        return CardManager.instance;
    }
    /**
     * Validates all sets for duplicate fullName and legacyFullName without loading.
     * Returns an array of error messages (one per duplicate). Empty if no issues.
     */
    static validateAllSets(entries) {
        const fullNameMap = {};
        const legacyFullNameMap = {};
        for (const { key, cards } of entries) {
            if (!Array.isArray(cards))
                continue;
            for (const card of cards) {
                const fullName = card.fullName;
                if (!fullNameMap[fullName])
                    fullNameMap[fullName] = [];
                fullNameMap[fullName].push({ key });
                const p = card;
                if (p.legacyFullName) {
                    const legacyName = p.legacyFullName;
                    if (!legacyFullNameMap[legacyName])
                        legacyFullNameMap[legacyName] = [];
                    legacyFullNameMap[legacyName].push({ key });
                }
            }
        }
        const errors = [];
        for (const [name, entriesList] of Object.entries(fullNameMap)) {
            if (entriesList.length > 1) {
                const setKeys = [...new Set(entriesList.map((e) => e.key))];
                errors.push(`Duplicate fullName '${name}': in ${setKeys.join(', ')}`);
            }
        }
        for (const [name, entriesList] of Object.entries(legacyFullNameMap)) {
            if (entriesList.length > 1) {
                const setKeys = [...new Set(entriesList.map((e) => e.key))];
                errors.push(`Duplicate legacyFullName '${name}': in ${setKeys.join(', ')}`);
            }
        }
        return errors;
    }
    defineSet(set) {
        for (const card of set) {
            if (this.cardIndex[card.fullName] !== undefined) {
                throw new Error('Multiple cards with the same name: ' + card.fullName);
            }
            const index = this.cards.length;
            this.cards.push(card);
            this.cardIndex[card.fullName] = index;
            const p = card;
            if (p.legacyFullName) {
                if (this.cardIndex[p.legacyFullName] !== undefined) {
                    throw new Error('Multiple cards with the same name: ' + p.legacyFullName);
                }
                this.cardIndex[p.legacyFullName] = index;
            }
        }
    }
    loadCardsInfo(cardsInfo) {
        this.cardIndex = {};
        this.cards = cardsInfo.cards;
        for (let i = 0; i < this.cards.length; i++) {
            this.cardIndex[this.cards[i].fullName] = i;
        }
    }
    defineCard(card) {
        if (this.cardIndex[card.fullName] !== undefined) {
            throw new Error('Multiple cards with the same name: ' + card.fullName);
        }
        const index = this.cards.length;
        this.cards.push(card);
        this.cardIndex[card.fullName] = index;
    }
    getCardByName(name) {
        const index = this.cardIndex[name];
        if (index !== undefined) {
            return deepClone(this.cards[index]);
        }
    }
    isCardDefined(name) {
        return this.cardIndex[name] !== undefined;
    }
    getAllCards() {
        return this.cards;
    }
}
