"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplashEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const state_1 = require("../../game/store/state/state");
class SplashEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'BKP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '113';
        this.name = 'Splash Energy';
        this.fullName = 'Splash Energy BKP';
        this.text = 'This card can only be attached to [W] Pokémon. This card provides [W] Energy only while this card is attached to a [W] Pokémon.' +
            '' +
            'If the [W] Pokémon this card is attached to is Knocked Out by damage from an opponent\'s attack, put that Pokémon into your hand. (Discard all cards attached to it.)' +
            '' +
            '(If this card is attached to anything other than a [W] Pokémon, discard this card.)';
        this.damageDealt = false;
        this.SPLASH_ENERGY_MARKER = 'SPLASH_ENERGY_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonType);
            if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.WATER)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && ((_b = (_a = effect.target) === null || _a === void 0 ? void 0 : _a.cards) === null || _b === void 0 ? void 0 : _b.includes(this))) {
            this.damageDealt = false;
        }
        if ((effect instanceof attack_effects_1.DealDamageEffect || effect instanceof attack_effects_1.PutDamageEffect) &&
            effect.target.cards.includes(this)) {
            this.damageDealt = true;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player === game_1.StateUtils.getOpponent(state, effect.player)) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner === effect.player) {
                this.damageDealt = false;
            }
        }
        // Discard card when not attached to Water Pokemon
        if (effect instanceof play_card_effects_1.AttachEnergyEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    var _a;
                    if (!cardList.cards.includes(this)) {
                        return;
                    }
                    const pokemon = cardList;
                    if (((_a = pokemon.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) !== card_types_1.CardType.WATER) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
            return state;
        }
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.WATER] });
            return state;
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this) && this.damageDealt) {
            const player = effect.player;
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            const target = effect.target;
            const cards = target.getPokemons();
            cards.forEach(card => {
                player.marker.addMarker(this.SPLASH_ENERGY_MARKER, card);
            });
        }
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
            state.players.forEach(player => {
                if (!player.marker.hasMarker(this.SPLASH_ENERGY_MARKER)) {
                    return;
                }
                const rescued = player.marker.markers
                    .filter(m => m.name === this.SPLASH_ENERGY_MARKER)
                    .map(m => m.source)
                    .filter((card) => !!card);
                player.discard.moveCardsTo(rescued, player.hand);
                player.marker.removeMarker(this.SPLASH_ENERGY_MARKER);
            });
        }
        return state;
    }
}
exports.SplashEnergy = SplashEnergy;
