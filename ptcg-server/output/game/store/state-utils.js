"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateUtils = void 0;
const play_card_action_1 = require("./actions/play-card-action");
const card_types_1 = require("./card/card-types");
const game_error_1 = require("../game-error");
const game_message_1 = require("../game-message");
class StateUtils {
    static getStadium(state) {
        throw new Error('Method not implemented.');
    }
    static checkEnoughEnergy(energy, cost) {
        if (cost.length === 0) {
            return true;
        }
        const provides = [];
        energy.forEach(e => {
            e.provides.forEach(cardType => provides.push(cardType));
        });
        let colorless = 0;
        let rainbow = 0;
        // First remove from array cards with specific energy types
        cost.forEach(costType => {
            switch (costType) {
                case card_types_1.CardType.ANY:
                case card_types_1.CardType.NONE:
                    break;
                case card_types_1.CardType.COLORLESS:
                    colorless += 1;
                    break;
                default: {
                    const index = provides.findIndex(energy => energy === costType);
                    if (index !== -1) {
                        provides.splice(index, 1);
                    }
                    else {
                        rainbow += 1;
                    }
                }
            }
        });
        // Check if we have enough rainbow energies
        for (let i = 0; i < rainbow; i++) {
            const index = provides.findIndex(energy => energy === card_types_1.CardType.ANY);
            if (index !== -1) {
                provides.splice(index, 1);
            }
            else {
                return false;
            }
        }
        // Rest cards can be used to pay for colorless energies
        return provides.length >= colorless;
    }
    static checkExactEnergy(energy, cost) {
        let enough = StateUtils.checkEnoughEnergy(energy, cost);
        if (!enough) {
            return false;
        }
        for (let i = 0; i < energy.length; i++) {
            const tempCards = energy.slice();
            tempCards.splice(i, 1);
            enough = StateUtils.checkEnoughEnergy(tempCards, cost);
            if (enough) {
                return false;
            }
        }
        return true;
    }
    static getOpponent(state, player) {
        const opponent = state.players.find(p => p.id !== player.id);
        if (opponent === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_GAME_STATE);
        }
        return opponent;
    }
    static getTarget(state, player, target) {
        if (target.player === play_card_action_1.PlayerType.TOP_PLAYER) {
            player = StateUtils.getOpponent(state, player);
        }
        if (target.slot === play_card_action_1.SlotType.ACTIVE) {
            return player.active;
        }
        if (target.slot !== play_card_action_1.SlotType.BENCH) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
        }
        if (player.bench[target.index] === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
        }
        return player.bench[target.index];
    }
    static findCardList(state, card) {
        const cardLists = [];
        for (const player of state.players) {
            cardLists.push(player.active);
            cardLists.push(player.deck);
            cardLists.push(player.discard);
            cardLists.push(player.hand);
            cardLists.push(player.lostzone);
            cardLists.push(player.stadium);
            cardLists.push(player.supporter);
            player.bench.forEach(item => cardLists.push(item));
            player.prizes.forEach(item => cardLists.push(item));
        }
        const cardList = cardLists.find(c => c.cards.includes(card));
        if (cardList === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_GAME_STATE);
        }
        return cardList;
    }
    static findOwner(state, cardList) {
        for (const player of state.players) {
            const cardLists = [];
            cardLists.push(player.active);
            cardLists.push(player.deck);
            cardLists.push(player.discard);
            cardLists.push(player.hand);
            cardLists.push(player.stadium);
            cardLists.push(player.supporter);
            player.bench.forEach(item => cardLists.push(item));
            player.prizes.forEach(item => cardLists.push(item));
            if (cardLists.includes(cardList)) {
                return player;
            }
        }
        throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_GAME_STATE);
    }
    static getStadiumCard(state) {
        for (const player of state.players) {
            if (player.stadium.cards.length > 0) {
                return player.stadium.cards[0];
            }
        }
        return undefined;
    }
}
exports.StateUtils = StateUtils;
