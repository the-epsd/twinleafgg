"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gallade = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Gallade extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kirlia';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 170;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Feint',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 60,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            },
            {
                name: 'Dynablade',
                cost: [C, C],
                damage: 60,
                text: 'This attack does 60 damage for each of your opponent\'s Pokémon V in play.'
            }
        ];
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.name = 'Gallade';
        this.fullName = 'Gallade CRE';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.ignoreResistance = true;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const benchPokemon = opponent.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined);
            const vPokemons = benchPokemon.filter(card => card.tags.includes(card_types_1.CardTag.POKEMON_V || card_types_1.CardTag.POKEMON_VSTAR || card_types_1.CardTag.POKEMON_VMAX));
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && opponentActive.tags.includes(card_types_1.CardTag.POKEMON_V || card_types_1.CardTag.POKEMON_VSTAR || card_types_1.CardTag.POKEMON_VMAX || card_types_1.CardTag.POKEMON_ex)) {
                vPokemons.push(opponentActive);
            }
            effect.ignoreResistance = false;
            effect.ignoreWeakness = false;
            let vPokes = vPokemons.length;
            if (opponentActive) {
                vPokes++;
            }
            effect.damage *= vPokes;
        }
        return state;
    }
}
exports.Gallade = Gallade;
