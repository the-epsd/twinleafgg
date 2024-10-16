"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poipole = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
// LOT Poipole 107 (https://limitlesstcg.com/cards/LOT/107)
class Poipole extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.ULTRA_BEAST];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Eye Opener',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Look at your face-down Prize cards.'
            },
            {
                name: 'Peck',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            },
        ];
        this.set = 'LOT';
        this.name = 'Poipole';
        this.fullName = 'Poipole LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
    }
    reduceEffect(store, state, effect) {
        // Eye Opener
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const prizes = player.prizes.filter(p => p.isSecret);
            const cards = [];
            prizes.forEach(p => { p.cards.forEach(c => cards.push(c)); });
            // All prizes are face-up
            if (cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Make prizes no more secret, before displaying prompt
            prizes.forEach(p => { p.isSecret = false; });
            state = store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_EFFECT, cards), () => { });
            // Prizes are secret once again.
            prizes.forEach(p => { p.isSecret = true; });
            return state;
        }
        return state;
    }
}
exports.Poipole = Poipole;
