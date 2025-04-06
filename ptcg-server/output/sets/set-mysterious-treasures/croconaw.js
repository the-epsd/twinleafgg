"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Croconaw = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Croconaw extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Totodile';
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: L, value: +20 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Evolutionary Vitality',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you play Croconaw from your hand to evolve 1 of your Pokémon, you may look at the top 5 cards of your deck. Choose all Energy cards you find there, show them to your opponent, and put them into your hand. Put the other cards back on top of your deck. Shuffle your deck afterward.'
            }];
        this.attacks = [{
                name: 'Hover Over',
                cost: [W, C],
                damage: 30,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            }];
        this.set = 'MT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Croconaw';
        this.fullName = 'Croconaw MT';
        this.HOVER_OVER_MARKER = 'HOVER_OVER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.JUST_EVOLVED(effect, this) && !prefabs_1.IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const temp = new game_1.CardList();
            player.deck.moveTo(temp, 5);
            // Check if any cards drawn are basic energy
            const energyCardsDrawn = temp.cards.filter(card => {
                return card instanceof game_1.EnergyCard;
            });
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, temp, { superType: game_1.SuperType.ENERGY }, { allowCancel: false, min: energyCardsDrawn.length, max: energyCardsDrawn.length }), chosenCards => {
                if (chosenCards.length == 0) {
                    // No Energy chosen, shuffle all back
                    temp.cards.forEach(card => {
                        temp.moveCardTo(card, player.deck);
                    });
                }
                if (chosenCards.length > 0) {
                    // Move chosen Energy to hand
                    const energyCard = chosenCards[0];
                    temp.moveCardTo(energyCard, player.hand);
                    player.supporter.moveCardTo(this, player.discard);
                    temp.moveTo(player.deck);
                    chosenCards.forEach((card, index) => {
                        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                    });
                    if (chosenCards.length > 0) {
                        state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, chosenCards), () => state);
                    }
                }
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.ADD_MARKER(this.HOVER_OVER_MARKER, opponent.active, this);
        }
        prefabs_1.BLOCK_RETREAT_IF_MARKER(effect, this.HOVER_OVER_MARKER, this);
        prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, this.HOVER_OVER_MARKER, this);
        return state;
    }
}
exports.Croconaw = Croconaw;
