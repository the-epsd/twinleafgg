"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flapple = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Flapple extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 80;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Acidic Mucus',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 50 damage for each of your opponent\'s Pokémon in play that has an Ability.'
            },
            {
                name: 'Fighting Tackle',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.FIRE],
                damage: 80,
                text: 'If your opponent\'s Active Pokémon is a Pokémon V, this attack does 80 more damage.'
            }
        ];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '120';
        this.name = 'Flapple';
        this.fullName = 'Flapple EVS';
        this.evolvesFrom = 'Applin';
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
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.getPokemonCard() &&
                (opponent.active.getPokemonCard().tags.includes(card_types_1.CardTag.POKEMON_V) ||
                    opponent.active.getPokemonCard().tags.includes(card_types_1.CardTag.POKEMON_VMAX) ||
                    opponent.active.getPokemonCard().tags.includes(card_types_1.CardTag.POKEMON_VSTAR))) {
                effect.damage += 80;
            }
            return state;
        }
        return state;
    }
}
exports.Flapple = Flapple;
