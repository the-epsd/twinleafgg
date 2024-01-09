export class AddPlayerAction {
    constructor(clientId, name, deck) {
        this.clientId = clientId;
        this.name = name;
        this.deck = deck;
        this.type = 'ADD_PLAYER';
    }
}
