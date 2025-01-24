"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreninjaBKP = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class GreninjaBKP extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Frogadier';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Shadow Stitching',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 40,
                text: 'Until the end of your opponent\'s next turn, each Pokémon your opponent has in play, in his or her hand, and in his or her discard pile has no Abilities. (This includes cards that come into play on that turn.)'
            },
            {
                name: 'Moonlight Slash',
                cost: [card_types_1.CardType.WATER],
                damage: 60,
                text: ' You may return a [W] Energy from this Pokémon to your hand. If you do, this attack does 20 more damage.'
            },
        ];
        this.set = 'BKP';
        this.setNumber = '40';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Greninja';
        this.fullName = 'Greninja BKP';
        // ability locking gaming
        this.SHADOW_STITCHING_MARKER = 'SHADOW_STITCHING_MARKER';
        this.CLEAR_SHADOW_STITCHING_MARKER = 'CLEAR_SHADOW_STITCHING_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.SHADOW_STITCHING_MARKER, this);
        }
        // Shadow Stitching
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.SHADOW_STITCHING_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_SHADOW_STITCHING_MARKER, this);
        }
        // Mist Slash
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
                    state = store.reduceEffect(state, checkProvidedEnergy);
                    state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.WATER], { allowCancel: false }), energy => {
                        const cards = (energy || []).map(e => e.card);
                        player.active.moveCardsTo(cards, player.hand);
                        effect.damage += 20;
                    });
                }
            });
        }
        // the shadow ability blocking
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === game_1.PowerType.ABILITY) {
            const player = effect.player;
            if (!player.marker.hasMarker(this.CLEAR_SHADOW_STITCHING_MARKER, this)) {
                return state;
            }
            // checking if the effect is one you own
            let doesPlayerOwn = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    doesPlayerOwn = true;
                }
            });
            if (doesPlayerOwn) {
                return state;
            }
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
        }
        // wow ability locking off an attack is actually pretty difficult
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_SHADOW_STITCHING_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_SHADOW_STITCHING_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.SHADOW_STITCHING_MARKER, this);
            });
        }
        return state;
    }
}
exports.GreninjaBKP = GreninjaBKP;
