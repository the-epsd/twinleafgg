"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eevee = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Eevee extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.COLORLESS;
        this.hp = 50;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Boosted Evolution',
                text: 'As long as this Pokémon is in the Active Spot, it can evolve during your first turn or the turn you play it.',
                powerType: game_1.PowerType.ABILITY
            }];
        this.attacks = [{
                name: 'Reckless Charge',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 30,
                text: 'This Pokémon also does 10 damage to itself.'
            }];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.name = 'Eevee';
        this.fullName = 'Eevee SVP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '143';
        this.EVOLUTIONARY_ADVANTAGE_MARKER = 'EVOLUTIONARY_ADVANTAGE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 10);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.EVOLUTIONARY_ADVANTAGE_MARKER, this);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect) {
            const player = effect.player;
            player.marker.addMarker(this.EVOLUTIONARY_ADVANTAGE_MARKER, this);
        }
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            const player = state.players[state.activePlayer];
            if (player.active.cards[0] == this) {
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
                player.canEvolve = true;
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.pokemonPlayedTurn = state.turn - 1;
                    }
                });
            }
            return state;
        }
        return state;
    }
}
exports.Eevee = Eevee;
