"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Victini = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const __1 = require("../..");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Victini extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Flippity Flap',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Shuffle your hand into your deck. Then, draw 6 cards.'
            },
            {
                name: 'Singe Off',
                cost: [card_types_1.CardType.FIRE],
                damage: 30,
                text: 'Discard a Special Energy from your opponent\'s Active Pokémon.'
            }
        ];
        this.set = 'TEF';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '30';
        this.name = 'Victini';
        this.fullName = 'Victini TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const cards = player.hand.cards.filter(c => c !== this);
            if (cards.length > 0) {
                player.hand.moveCardsTo(cards, player.deck);
                store.prompt(state, new __1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            }
            player.deck.moveTo(player.hand, 6);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            const oppActive = opponent.active;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, oppActive);
            store.reduceEffect(state, checkEnergy);
            checkEnergy.energyMap.forEach(em => {
                const energyCard = em.card;
                if (energyCard instanceof __1.EnergyCard && energyCard.energyType === card_types_1.EnergyType.SPECIAL) {
                    let cards = [];
                    store.prompt(state, new __1.ChooseCardsPrompt(player, __1.GameMessage.CHOOSE_CARD_TO_DISCARD, oppActive, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL }, { min: 1, max: 1, allowCancel: false }), selected => {
                        cards = selected;
                    });
                    oppActive.moveCardsTo(cards, opponent.discard);
                }
            });
        }
        return state;
    }
}
exports.Victini = Victini;
