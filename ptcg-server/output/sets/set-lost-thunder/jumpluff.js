"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jumpluff = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Jumpluff extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Skiploom';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Lost March',
                cost: [card_types_1.CardType.GRASS],
                damage: 20,
                text: 'This attack does 20 damage for each of your Pokémon, except Prism Star (Prism Star) Pokémon, in the Lost Zone.'
            }
        ];
        this.set = 'LOT';
        this.setNumber = '14';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Jumpluff';
        this.fullName = 'Jumpluff LOT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let pokemonCount = 0;
            player.lostzone.cards.forEach(c => {
                if (c instanceof pokemon_card_1.PokemonCard /* && !c.tags.includes(CardTag.PRISM_STAR)*/) {
                    pokemonCount += 1;
                }
            });
            effect.damage = pokemonCount * 20;
        }
        return state;
    }
}
exports.Jumpluff = Jumpluff;
