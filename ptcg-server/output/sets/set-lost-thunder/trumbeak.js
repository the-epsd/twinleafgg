"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trumbeak = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const card_types_2 = require("../../game/store/card/card-types");
const game_2 = require("../../game");
const game_3 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Trumbeak extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pikipek';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Mountain Pass',
                useFromHand: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokémon is in your hand, you may reveal it. If you do, look at the top card of your opponent\'s deck and put this Pokémon in the Lost Zone. If that card is a Supporter card, you may put it in the Lost Zone. If your opponent has no cards in their deck, you can\'t use this Ability.'
            }];
        this.attacks = [
            {
                name: 'Peck',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'LOT';
        this.setNumber = '165';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Trumbeak';
        this.fullName = 'Trumbeak LOT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.hand.moveCardTo(this, player.lostzone);
            const cards = [];
            const card = opponent.deck.cards[0];
            cards.push(card);
            const deckTop = new game_3.CardList();
            opponent.deck.moveTo(deckTop, 1);
            console.log(deckTop);
            return store.prompt(state, new game_2.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, deckTop, { superType: card_types_2.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 0, max: 1, allowCancel: false }), selected => {
                const cards = selected || [];
                if (!cards) {
                    deckTop.moveTo(opponent.deck, 1);
                }
                if (cards) {
                    deckTop.moveCardsTo(cards, opponent.discard);
                }
            });
        }
        return state;
    }
}
exports.Trumbeak = Trumbeak;
