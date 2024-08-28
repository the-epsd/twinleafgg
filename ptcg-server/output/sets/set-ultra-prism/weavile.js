"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weavile = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Weavile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 90;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.attacks = [
            {
                name: 'Icy Wind',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'Your opponent\'s Active Pokémon is now Asleep.'
            },
            {
                name: 'Evil Admonition',
                cost: [card_types_1.CardType.DARK],
                damage: 50,
                damageCalculation: 'x',
                text: 'This attack does 50 damage for each of your opponent\'s Pokémon that has an Ability.'
            }
        ];
        this.set = 'UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.name = 'Weavile';
        this.fullName = 'Weavile UPR';
        this.evolvesFrom = 'Sneasel';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let benchPokemon = [];
            const pokemonWithAbilities = [];
            const opponentActive = opponent.active.getPokemonCard();
            const stubPowerEffectForActive = new game_effects_1.PowerEffect(opponent, {
                name: 'test',
                powerType: game_1.PowerType.ABILITY,
                text: ''
            }, opponent.active.getPokemonCard());
            try {
                store.reduceEffect(state, stubPowerEffectForActive);
                if (opponentActive && opponentActive.powers.length) {
                    pokemonWithAbilities.push(opponentActive);
                }
            }
            catch (_a) {
                // no abilities in active
            }
            if (opponent.bench.some(b => b.cards.length > 0)) {
                const stubPowerEffectForBench = new game_effects_1.PowerEffect(opponent, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, opponent.bench.filter(b => b.cards.length > 0)[0].getPokemonCard());
                try {
                    store.reduceEffect(state, stubPowerEffectForBench);
                    benchPokemon = opponent.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined);
                    pokemonWithAbilities.push(...benchPokemon.filter(card => card.powers.length));
                }
                catch (_b) {
                    // no abilities on bench
                }
            }
            const abilities = pokemonWithAbilities.length;
            effect.damage = abilities * 50;
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const sleepEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            store.reduceEffect(state, sleepEffect);
            return state;
        }
        return state;
    }
}
exports.Weavile = Weavile;
