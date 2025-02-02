"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zweilous = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
function* useWhirlpool(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    // Defending Pokemon has no energy cards attached
    if (!opponent.active.cards.some(c => c instanceof game_1.EnergyCard)) {
        return state;
    }
    let flipResult = false;
    yield store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), result => {
        flipResult = result;
        next();
    });
    if (!flipResult) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
    return store.reduceEffect(state, discardEnergy);
}
class Zweilous extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Deino';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.DRAGON }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Crunch',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Flip a coin. If heads, discard an Energy attached to ' +
                    'the Defending Pokemon.'
            },
            {
                name: 'Dragon Claw',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.DARK, card_types_1.CardType.DARK],
                damage: 80,
                text: ''
            }
        ];
        this.set = 'DRX';
        this.name = 'Zweilous';
        this.fullName = 'Zweilous DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useWhirlpool(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Zweilous = Zweilous;
