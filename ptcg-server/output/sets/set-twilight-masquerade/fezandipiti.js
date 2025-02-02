"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FezandipitiTWM = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class FezandipitiTWM extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Adrena-Pheromone',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokemon has any [D] Energy attached and is damaged by an attack, flip a coin. If heads, prevent that damage.',
            }];
        this.attacks = [
            {
                name: 'Energy Feather',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 30,
                text: 'This attack does 30 damage for each Energy attached to this Pokemon.'
            },
        ];
        this.set = 'TWM';
        this.setNumber = '96';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Fezandipiti';
        this.fullName = 'Fezandipiti TWM';
    }
    reduceEffect(store, state, effect) {
        // Adrena-Pheromone
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = effect.opponent;
            const cardList = game_1.StateUtils.findCardList(state, this);
            // Only blocks damage from attacks
            if (effect.target !== cardList || state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            // Check if we have dark energy attached
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let hasDarkEnergy = false;
            checkProvidedEnergyEffect.energyMap.forEach(energy => { energy.provides.forEach(e => { if (e == card_types_1.CardType.DARK) {
                hasDarkEnergy = true;
            } }); });
            if (!hasDarkEnergy) {
                return state;
            }
            // Flip a coin, and if heads, prevent damage.
            try {
                const coinFlip = new play_card_effects_1.CoinFlipEffect(player);
                store.reduceEffect(state, coinFlip);
            }
            catch (_b) {
                return state;
            }
            const coinFlipResult = prefabs_1.SIMULATE_COIN_FLIP(store, state, player);
            if (!coinFlipResult) {
                effect.damage = 0;
                store.log(state, game_1.GameLog.LOG_ABILITY_BLOCKS_DAMAGE, { name: opponent.name, pokemon: this.name });
            }
        }
        // Energy Feather
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energies = 0;
            checkProvidedEnergyEffect.energyMap.forEach(energy => { energy.provides.forEach(e => { energies++; }); });
            effect.damage = 30 * energies;
        }
        return state;
    }
}
exports.FezandipitiTWM = FezandipitiTWM;
