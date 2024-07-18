"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hoopa = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Hoopa extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Evil Admonition',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'This attack does 20 more damage for each of your opponent\'s Pokémon that has an Ability.'
            },
            {
                name: 'Mind Shock',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
            }];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '140';
        this.name = 'Hoopa';
        this.fullName = 'Hoopa UNM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const benchPokemon = opponent.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined);
            const vPokemons = benchPokemon.filter(card => card.powers.length);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && opponentActive.powers.length) {
                vPokemons.push(opponentActive);
            }
            const vPokes = vPokemons.length;
            effect.damage += vPokes * 20;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            effect.ignoreResistance = true;
            effect.ignoreWeakness = true;
        }
        return state;
    }
}
exports.Hoopa = Hoopa;
