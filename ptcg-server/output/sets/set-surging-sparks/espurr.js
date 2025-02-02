"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Espurr = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Espurr extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'See Through',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Your opponent reveals their hand.'
            },
            {
                name: 'Psyshot',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            },
        ];
        this.set = 'SSP';
        this.setNumber = '84';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Espurr';
        this.fullName = 'Espurr SSP';
    }
    reduceEffect(store, state, effect) {
        // See Through
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_EFFECT, opponent.hand.cards), () => { });
        }
        return state;
    }
}
exports.Espurr = Espurr;
