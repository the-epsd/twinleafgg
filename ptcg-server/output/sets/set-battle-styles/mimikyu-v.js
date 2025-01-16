"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MimikyuV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class MimikyuV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 160;
        this.weakness = [{
                type: card_types_1.CardType.DARK
            }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Dummmy Doll',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may prevent all damage done to this Mimikyu V by attacks from your opponent\'s Pokémon until the end of your opponent\'s next turn.'
            }];
        this.attacks = [
            {
                name: 'Jealous Eyes',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 30,
                text: 'Put 3 damage counters on your opponent\'s Active Pokémon ' +
                    'for each Prize card your opponent has taken. '
            }
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
        this.regulationMark = 'E';
        this.name = 'Mimikyu V';
        this.fullName = 'Mimikyu V BST';
        this.DUMMY_DOLL_MARKER = 'DUMMY_DOLL_MARKER';
        this.CLEAR_DUMMY_DOLL_MARKER = 'CLEAR_DUMMY_DOLL_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
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
                    cardList.marker.addMarker(this.DUMMY_DOLL_MARKER, this);
                }
            });
            return state;
        }
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this) && effect.target.marker.hasMarker(this.DUMMY_DOLL_MARKER, this)) {
            effect.preventDefault = true;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.DUMMY_DOLL_MARKER, this)) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                (_a = cardList.marker) === null || _a === void 0 ? void 0 : _a.removeMarker(this.DUMMY_DOLL_MARKER, this);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const prizesTaken = 6 - opponent.getPrizeLeft();
            const damagePerPrize = 30 * prizesTaken;
            const damageEffect = new attack_effects_1.PutCountersEffect(effect, damagePerPrize);
            damageEffect.target = opponent.active;
            store.reduceEffect(state, damageEffect);
        }
        return state;
    }
}
exports.MimikyuV = MimikyuV;
