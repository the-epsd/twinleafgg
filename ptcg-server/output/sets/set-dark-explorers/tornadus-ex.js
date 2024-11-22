"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TornadusEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_message_1 = require("../../game/game-message");
function* usePowerBlast(next, store, state, effect) {
    const player = effect.player;
    // Active Pokemon has no energy cards attached
    if (!player.active.cards.some(c => c instanceof game_1.EnergyCard)) {
        return state;
    }
    let flipResult = false;
    yield store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), result => {
        flipResult = result;
        next();
    });
    if (flipResult) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
    discardEnergy.target = player.active;
    return store.reduceEffect(state, discardEnergy);
}
class TornadusEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 170;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Blow Through',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'If there is any Stadium card in play, this attack does 30 ' +
                    'more damage.'
            }, {
                name: 'Power Blast',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: 'Flip a coin. If tails, discard an Energy attached to this Pokemon.'
            },
        ];
        this.set = 'DEX';
        this.name = 'Tornadus EX';
        this.fullName = 'Tornadus EX DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            if (game_1.StateUtils.getStadiumCard(state) !== undefined) {
                effect.damage += 30;
            }
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const generator = usePowerBlast(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.TornadusEx = TornadusEx;
