"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pignite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
class Pignite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Tepig';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Flame Charge',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for a R Energy card and attach it to this ' +
                    'Pokemon. Shuffle your deck afterward.'
            },
            {
                name: 'Heat Crash',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'BLW';
        this.name = 'Pignite';
        this.fullName = 'Pignite BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList === undefined) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { min: 1, max: 1, allowCancel: true }), cards => {
                cards = cards || [];
                if (cards.length > 0) {
                    player.deck.moveCardsTo(cards, cardList);
                }
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Pignite = Pignite;
