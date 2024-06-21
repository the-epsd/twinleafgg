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
        this.setNumber = '119';
        this.name = 'Flapple';
        this.fullName = 'Flapple EVS';
        this.evolvesFrom = 'Applin';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const benchPokemon = opponent.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined);
            const pokemonWithAbilities = benchPokemon.filter(card => card.powers.length);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && opponentActive.powers.length) {
                pokemonWithAbilities.push(opponentActive);
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
