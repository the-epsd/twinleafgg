"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magmar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magmar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Smokescreen',
                cost: [R],
                damage: 10,
                text: 'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
            },
            {
                name: 'Smog',
                cost: [R, R],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
            }];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
        this.name = 'Magmar';
        this.fullName = 'Magmar FO';
        this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            try {
                const coinFlip = new play_card_effects_1.CoinFlipEffect(player);
                store.reduceEffect(state, coinFlip);
            }
            catch (_a) {
                return state;
            }
            const coinFlipResult = prefabs_1.SIMULATE_COIN_FLIP(store, state, player);
            if (!coinFlipResult) {
                effect.damage = 0;
                store.log(state, game_1.GameLog.LOG_ABILITY_BLOCKS_DAMAGE, { name: opponent.name, pokemon: this.name });
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this)) {
            effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            state = store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                if (results) {
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
                    store.reduceEffect(state, specialConditionEffect);
                }
            });
            return state;
        }
        return state;
    }
}
exports.Magmar = Magmar;
