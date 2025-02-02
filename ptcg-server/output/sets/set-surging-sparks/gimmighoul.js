"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gimmighoul = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Gimmighoul extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Minor Errand-Running',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 2 Basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Tackle',
                cost: [C, C, C],
                damage: 50,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.setNumber = '97';
        this.set = 'SSP';
        this.name = 'Gimmighoul';
        this.fullName = 'Gimmighoul SSP';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Minor Errand-Running
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_2.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 2, allowCancel: false }), selected => {
                cards = selected || [];
                player.deck.moveCardsTo(cards, player.hand);
            });
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        }
        return state;
    }
}
exports.Gimmighoul = Gimmighoul;
