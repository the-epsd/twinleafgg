"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Natu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Natu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Lost March',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'This attack does 20 damage for each of your Pokémon, except Prism Star (Prism Star) Pokémon, in the Lost Zone.'
            }
        ];
        this.set = 'LOT';
        this.setNumber = '87';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Natu';
        this.fullName = 'Natu LOT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let pokemonCount = 0;
            player.lostzone.cards.forEach(c => {
                if (c instanceof pokemon_card_1.PokemonCard /*&& !c.tags.includes(CardTag.PRISM_STAR)*/) {
                    pokemonCount += 1;
                }
            });
            effect.damage = pokemonCount * 20;
        }
        return state;
    }
}
exports.Natu = Natu;
