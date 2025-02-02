"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VictiniPrismStar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class VictiniPrismStar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.PRISM_STAR];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Infinity',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 0,
                text: 'This attack does 20 damage for each basic Energy card in your discard pile. ' +
                    'Then, shuffle those cards into your deck.'
            },
        ];
        this.set = 'DRM';
        this.setNumber = '7';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Victini Prism Star';
        this.fullName = 'Victini Prism Star DRM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const shuffleList = [];
            player.discard.cards.forEach(c => {
                if ((c instanceof game_1.EnergyCard) && (c.energyType == card_types_1.EnergyType.BASIC)) {
                    shuffleList.push(c);
                }
            });
            effect.damage = 20 * shuffleList.length;
            player.discard.moveCardsTo(shuffleList, player.deck);
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => { player.deck.applyOrder(order); });
        }
        return state;
    }
}
exports.VictiniPrismStar = VictiniPrismStar;
