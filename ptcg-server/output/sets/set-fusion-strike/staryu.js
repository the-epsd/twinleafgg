"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Staryu = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Staryu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.tags = [card_types_1.CardTag.RAPID_STRIKE];
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Soak in Water',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Attach a [W] Energy card from your hand to this Pokémon.'
            },
            {
                name: 'Spinning Attack',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: ''
            }
        ];
        this.regulationMark = 'E';
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '52';
        this.name = 'Staryu';
        this.fullName = 'Staryu FST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.WATER);
            });
            if (!hasEnergyInHand) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.hand, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { min: 0, max: 1, allowCancel: false }), cards => {
                cards = cards || [];
                if (cards.length > 0) {
                    const cardList = game_1.StateUtils.findCardList(state, this);
                    player.hand.moveCardsTo(cards, cardList);
                }
            });
        }
        return state;
    }
}
exports.Staryu = Staryu;
