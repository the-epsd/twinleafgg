"use strict";
exports.__esModule = true;
exports.AddPlayerAction = void 0;
var AddPlayerAction = /** @class */ (function () {
    function AddPlayerAction(clientId, name, deck) {
        this.clientId = clientId;
        this.name = name;
        this.deck = deck;
        this.type = 'ADD_PLAYER';
    }
    return AddPlayerAction;
}());
exports.AddPlayerAction = AddPlayerAction;
