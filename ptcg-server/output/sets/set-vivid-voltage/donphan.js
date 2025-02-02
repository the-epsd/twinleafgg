"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonphanVIV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class DonphanVIV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Phanpy';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Earthquake',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 120,
                text: 'This attack also does 20 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Heavy Impact',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: ''
            }
        ];
        this.set = 'VIV';
        this.name = 'Donphan';
        this.fullName = 'Donphan VIV';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '87';
    }
    reduceEffect(store, state, effect) {
        // Earthquake
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (cardList !== player.active) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                    damageEffect.target = cardList;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.DonphanVIV = DonphanVIV;
