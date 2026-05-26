export class AddPlayerAction {
    constructor(clientId, name, deck, artworksMap, deckId) {
        this.clientId = clientId;
        this.name = name;
        this.deck = deck;
        this.artworksMap = artworksMap;
        this.deckId = deckId;
        this.type = 'ADD_PLAYER';
    }
}
