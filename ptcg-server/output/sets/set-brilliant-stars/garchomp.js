"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Garchomp = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Garchomp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gabite';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 160;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Sonic Slip',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may prevent all damage from and effects of attacks done to this Pokémon until the end of your opponent\'s next turn.'
            }];
        this.attacks = [
            {
                name: 'Dragonblade',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.FIGHTING],
                damage: 160,
                text: 'Discard the top 2 cards of your deck.'
            }
        ];
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '109';
        this.regulationMark = 'F';
        this.name = 'Garchomp';
        this.fullName = 'Garchomp BRS';
        this.SONIC_SLIP_MARKER = 'SONIC_SLIP_MARKER';
        this.CLEAR_SONIC_SLIP_MARKER = 'CLEAR_SONIC_SLIP_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Discard 2 cards from your deck 
            player.deck.moveTo(player.discard, 2);
            return state;
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_b) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const cardList = game_1.StateUtils.findCardList(state, this);
                    cardList.marker.addMarker(this.SONIC_SLIP_MARKER, this);
                }
            });
            return state;
        }
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this) && effect.target.marker.hasMarker(this.SONIC_SLIP_MARKER, this)) {
            effect.preventDefault = true;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                (_a = cardList.marker) === null || _a === void 0 ? void 0 : _a.removeMarker(this.SONIC_SLIP_MARKER, this);
            }
        }
        return state;
    }
}
exports.Garchomp = Garchomp;
