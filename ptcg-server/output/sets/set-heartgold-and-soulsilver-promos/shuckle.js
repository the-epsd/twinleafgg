"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shuckle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Shuckle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Fermenting Liquid',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Whenever you attach an Energy card from your hand to Shuckle, ' +
                    'draw a card.'
            }];
        this.attacks = [
            {
                name: 'Shell Stunner',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Flip a coin. If heads, prevent all damage done to Shuckle by ' +
                    'attacks during your opponent\'s next turn.'
            }
        ];
        this.set = 'HSP';
        this.name = 'Shuckle';
        this.fullName = 'Shuckle HSP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
        this.SHELL_STUNNER_MAREKER = 'SHELL_STUNNER_MAREKER';
        this.CLEAR_SHELL_STUNNER_MAREKER = 'CLEAR_SHELL_STUNNER_MAREKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const pokemonCard = effect.target.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            player.deck.moveTo(player.hand, 1);
            return state;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.target.marker.hasMarker(this.SHELL_STUNNER_MAREKER)) {
            effect.preventDefault = true;
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            state = store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), flipResult => {
                if (flipResult) {
                    player.active.marker.addMarker(this.SHELL_STUNNER_MAREKER, this);
                    opponent.marker.addMarker(this.CLEAR_SHELL_STUNNER_MAREKER, this);
                }
            });
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_SHELL_STUNNER_MAREKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_SHELL_STUNNER_MAREKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.SHELL_STUNNER_MAREKER, this);
            });
        }
        return state;
    }
}
exports.Shuckle = Shuckle;
