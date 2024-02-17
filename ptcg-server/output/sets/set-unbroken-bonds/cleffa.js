"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cleffa = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
function* useExcitableDraw(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length + player.hand.cards.length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
    }
    let flipResult = false;
    yield store.prompt(state, [
        new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
    ], result => {
        flipResult = result;
        next();
    });
    if (flipResult) {
        player.hand.moveTo(player.deck);
        yield store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
            player.deck.moveTo(player.hand, 6);
            next();
        });
    }
    const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
    store.reduceEffect(state, endTurnEffect);
    return state;
}
class Cleffa extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FAIRY;
        this.hp = 60;
        this.retreat = [];
        this.powers = [{
                name: 'Excitable Draw',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may flip a coin. ' +
                    'If heads, shuffle your hand into your deck and then draw 6 cards. ' +
                    'If you use this Ability, your turn ends.'
            }];
        this.set = 'UNB';
        this.name = 'Cleffa';
        this.fullName = 'Cleffa UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '131';
    }
    reduceEffect(store, state, effect) {
        // Eeeeeeek
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const generator = useExcitableDraw(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Cleffa = Cleffa;
