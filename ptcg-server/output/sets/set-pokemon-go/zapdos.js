"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zapdos = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Zapdos extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Lightning Symbol',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Your Basic [L] Pokémon\'s attacks, except any Zapdos, do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Electric Ball',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 110,
                text: ''
            }
        ];
        this.regulationMark = 'F';
        this.set = 'PGO';
        this.set2 = 'pokemongo';
        this.setNumber = '29';
        this.name = 'Zapdos';
        this.fullName = 'Zapdos PGO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const damage = 10; // set base damage boost to 10
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (cardList.isBasic() && card.cardType === card_types_1.CardType.LIGHTNING) {
                    // check if basic lightning pokemon
                    if (card.name !== 'Zapdos') {
                        // exclude Zapdos
                        effect.damage += damage;
                    }
                }
            });
            return state;
        }
        return state;
    }
}
exports.Zapdos = Zapdos;
