"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unown = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Unown extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Farewell Letter',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokemon is ' +
                    'on your Bench, you may discard this Pokemon and all cards attached ' +
                    'to it (this does not count as a Knock Out). If you do, draw a card.'
            }];
        this.attacks = [
            {
                name: 'Hidden Power',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'AOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '30';
        this.name = 'Unown';
        this.fullName = 'Unown AOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            // check if UnownR is on player's Bench
            const benchIndex = player.bench.indexOf(cardList);
            if (benchIndex === -1) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.bench[benchIndex].moveTo(player.discard);
            player.bench[benchIndex].clearEffects();
            player.deck.moveTo(player.hand, 1);
            return state;
        }
        return state;
    }
}
exports.Unown = Unown;
