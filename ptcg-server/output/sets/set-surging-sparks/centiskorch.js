"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Centiskorch = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Centiskorch extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sizzlipede';
        this.cardType = R;
        this.hp = 130;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            { name: 'Billowing Heat Wave', cost: [R], damage: 130, text: 'This attack also does 30 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)' },
            { name: 'Heat Blast', cost: [C, C, C], damage: 80, text: '' },
        ];
        this.set = 'SSP';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.name = 'Centiskorch';
        this.fullName = 'Centiskorch SSP';
    }
    reduceEffect(store, state, effect) {
        // Billowing Heat Wave
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList !== player.active) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                    damageEffect.target = cardList;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.Centiskorch = Centiskorch;
