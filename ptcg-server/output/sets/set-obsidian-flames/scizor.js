"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scizor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Scizor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Scyther';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.attacks = [
            {
                name: 'Punishing Scissors',
                cost: [card_types_1.CardType.METAL],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 50 more damage for each of your opponent\'s Pokémon in play that has an Ability.'
            },
            {
                name: 'Cut',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL],
                damage: 70,
                text: ''
            },
        ];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '141';
        this.name = 'Scizor';
        this.fullName = 'Scizor OBF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
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
            effect.damage += abilities * 50;
            return state;
        }
        return state;
    }
}
exports.Scizor = Scizor;
