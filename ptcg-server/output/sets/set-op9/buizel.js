"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buizel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const energy_card_1 = require("../../game/store/card/energy-card");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
function* useWhirlpool(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    // Defending Pokemon has no energy cards attached
    if (!opponent.active.cards.some(c => c instanceof energy_card_1.EnergyCard)) {
        return state;
    }
    let flipResult = false;
    yield store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), result => {
        flipResult = result;
        next();
    });
    if (!flipResult) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
    return store.reduceEffect(state, discardEnergy);
}
class Buizel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 60;
        this.weakness = [{
                type: card_types_1.CardType.LIGHTNING,
                value: 10
            }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Whirlpool',
                cost: [card_types_1.CardType.WATER],
                damage: 0,
                text: 'Flip a coin. If heads, discard an Energy attached to ' +
                    'the Defending Pokemon.'
            }, {
                name: 'Super Fast',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 30,
                text: 'If you have Pachirisu in play, flip a coin. If heads, prevent all ' +
                    'effects of an attack, including damage, done to Buizel during your ' +
                    'opponent\'s next turn.'
            }];
        this.set = 'OP9';
        this.name = 'Buizel';
        this.fullName = 'Buizel OP9';
        this.CLEAR_SUPER_FAST_MARKER = 'CLEAR_SUPER_FAST_MARKER';
        this.SUPER_FAST_MARKER = 'SUPER_FAST_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useWhirlpool(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let isPachirisuInPlay = false;
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Pachirisu') {
                    isPachirisuInPlay = true;
                }
            });
            if (isPachirisuInPlay) {
                const opponent = state_utils_1.StateUtils.getOpponent(state, player);
                state = store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), flipResult => {
                    if (flipResult) {
                        player.active.marker.addMarker(this.SUPER_FAST_MARKER, this);
                        opponent.marker.addMarker(this.CLEAR_SUPER_FAST_MARKER, this);
                    }
                });
            }
            return state;
        }
        if (effect instanceof attack_effects_1.AbstractAttackEffect
            && effect.target.marker.hasMarker(this.SUPER_FAST_MARKER)) {
            effect.preventDefault = true;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_SUPER_FAST_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_SUPER_FAST_MARKER, this);
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.SUPER_FAST_MARKER, this);
            });
        }
        return state;
    }
}
exports.Buizel = Buizel;
