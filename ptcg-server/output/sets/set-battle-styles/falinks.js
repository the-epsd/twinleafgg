"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Falinks = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Falinks extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.RAPID_STRIKE];
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Rapid Strike Squad',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'This attack does 20 damage for each of your Rapid Strike Pokémon in play.'
            }];
        this.set = 'BST';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.name = 'Falinks';
        this.fullName = 'Falinks BST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const vPokemons = player.bench.filter(card => card instanceof pokemon_card_1.PokemonCard && card.tags.includes(card_types_1.CardTag.RAPID_STRIKE));
            const vPokemons2 = player.active.getPokemons().filter(card => card.tags.includes(card_types_1.CardTag.RAPID_STRIKE));
            const vPokes = vPokemons.length + vPokemons2.length;
            const damage = 20 * vPokes;
            effect.damage = damage;
        }
        return state;
    }
}
exports.Falinks = Falinks;
