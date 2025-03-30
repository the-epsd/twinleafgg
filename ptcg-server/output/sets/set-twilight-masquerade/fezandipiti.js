"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fezandipiti = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Fezandipiti extends pokemon_card_1.PokemonCard {
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
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (pokemonCard !== this || sourceCard === undefined || state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            // Check if we have dark energy attached
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
            store.reduceEffect(state, checkEnergy);
            let hasDarkAttached = false;
            checkEnergy.energyMap.forEach(em => {
                var _a;
                if (em.provides.includes(card_types_1.CardType.ANY)) {
                    hasDarkAttached = true;
                }
                if (em.provides.includes(card_types_1.CardType.DARK)) {
                    hasDarkAttached = true;
                }
                const energyCard = em.card;
                if (energyCard instanceof game_1.EnergyCard && energyCard.provides.includes(card_types_1.CardType.DARK)) {
                    hasDarkAttached = true;
                }
                if (energyCard instanceof game_1.EnergyCard && energyCard.provides.includes(card_types_1.CardType.ANY)) {
                    hasDarkAttached = true;
                }
                if (energyCard instanceof game_1.EnergyCard && ((_a = energyCard.blendedEnergies) === null || _a === void 0 ? void 0 : _a.includes(card_types_1.CardType.DARK))) {
                    hasDarkAttached = true;
                }
            });
            if (!hasDarkAttached) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
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
            try {
                const coinFlip = new play_card_effects_1.CoinFlipEffect(player);
                store.reduceEffect(state, coinFlip);
            }
            catch (_b) {
                return state;
            }
            const coinFlipResult = prefabs_1.SIMULATE_COIN_FLIP(store, state, player);
            if (coinFlipResult) {
                effect.damage = 0;
                store.log(state, game_1.GameLog.LOG_ABILITY_BLOCKS_DAMAGE, { name: opponent.name, pokemon: this.name });
            }
            return state;
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
exports.Fezandipiti = Fezandipiti;
