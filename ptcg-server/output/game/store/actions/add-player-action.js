"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPlayerAction = void 0;
class AddPlayerAction {
    constructor(clientId, name, deck) {
        this.clientId = clientId;
        this.name = name;
        this.deck = deck;
        this.type = 'ADD_PLAYER';
    }
}
exports.AddPlayerAction = AddPlayerAction;
