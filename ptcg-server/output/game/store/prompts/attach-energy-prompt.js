"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachEnergyPrompt = exports.AttachEnergyPromptType = void 0;
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const prompt_1 = require("./prompt");
const card_types_1 = require("../card/card-types");
exports.AttachEnergyPromptType = 'Attach energy';
class AttachEnergyPrompt extends prompt_1.Prompt {
    constructor(playerId, message, cardList, playerType, slots, filter, options) {
        super(playerId);
        this.message = message;
        this.cardList = cardList;
        this.playerType = playerType;
        this.slots = slots;
        this.filter = filter;
        this.type = exports.AttachEnergyPromptType;
        // Default options
        this.options = Object.assign({}, {
            allowCancel: true,
            min: 0,
            max: cardList.cards.length,
            blocked: [],
            blockedTo: [],
            differentTypes: false,
            sameTarget: false,
            differentTargets: false
        }, options);
    }
    decode(result, state) {
        if (result === null) {
            return result;
        }
        const player = state.players.find(p => p.id === this.playerId);
        if (player === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
        }
        const transfers = [];
        result.forEach(t => {
            const cardList = this.cardList;
            const card = cardList.cards[t.index];
            // Verify card is an energy card
            if (card.superType !== card_types_1.SuperType.ENERGY) {
                throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
            }
            // Verify card is not blocked
            if (this.options.blocked.includes(t.index)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
            }
            transfers.push({ to: t.to, card });
        });
        return transfers;
    }
    validate(result) {
        if (result === null) {
            return this.options.allowCancel; // operation cancelled
        }
        if (result.length < this.options.min || result.length > this.options.max) {
            return false;
        }
        if (result.some(r => this.options.blocked.includes(this.cardList.cards.indexOf(r.card)))) {
            return false;
        }
        if (this.options.maxPerType) {
            const typeCounts = new Map();
            for (const assign of result) {
                const energyCard = assign.card;
                const type = energyCard.provides[0];
                typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
                if (typeCounts.get(type) > this.options.maxPerType) {
                    return false;
                }
            }
        }
        // Check if all targets are the same
        if (this.options.sameTarget && result.length > 1) {
            const t = result[0].to;
            const different = result.some(r => {
                return r.to.player !== t.player
                    || r.to.slot !== t.slot
                    || r.to.index !== t.index;
            });
            if (different) {
                return false;
            }
        }
        if (this.options.validCardTypes) {
            let onlyValidTypes = true;
            for (const assign of result) {
                const energyCard = assign.card;
                if (energyCard.provides.every(p => !this.options.validCardTypes.includes(p))) {
                    onlyValidTypes = false;
                }
            }
            return onlyValidTypes;
        }
        // Check if 'different types' restriction is valid
        if (this.options.differentTypes) {
            const typeMap = {};
            for (const assign of result) {
                const cardType = this.getCardType(assign.card);
                if (typeMap[cardType] === true) {
                    return false;
                }
                else {
                    typeMap[cardType] = true;
                }
            }
        }
        // Check if all selected targets are different
        if (this.options.differentTargets && result.length > 1) {
            for (let i = 0; i < result.length; i++) {
                const t = result[i].to;
                const index = result.findIndex(r => {
                    return r.to.player === t.player
                        && r.to.slot === t.slot
                        && r.to.index === t.index;
                });
                if (index !== i) {
                    return false;
                }
            }
        }
        return result.every(r => r.card !== undefined);
    }
    getCardType(card) {
        if (card.superType === card_types_1.SuperType.ENERGY) {
            const energyCard = card;
            return energyCard.provides.length > 0 ? energyCard.provides[0] : card_types_1.CardType.NONE;
        }
        if (card.superType === card_types_1.SuperType.POKEMON) {
            const pokemonCard = card;
            return pokemonCard.cardType;
        }
        return card_types_1.CardType.NONE;
    }
}
exports.AttachEnergyPrompt = AttachEnergyPrompt;
