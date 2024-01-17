"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapuKokoVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class TapuKokoVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VMAX];
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Tapu Koko V';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 320;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Max Shock',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 180,
                text: 'If you have more Prize cards remaining than your ' +
                    'opponent, their Active Pokémon is now Paralyzed.'
            }
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
        this.name = 'Tapu Koko VMAX';
        this.fullName = 'Tapu Koko VMAX BST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.getPrizeLeft() >= opponent.getPrizeLeft()) {
                const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                store.reduceEffect(state, specialConditionEffect);
            }
        }
        return state;
    }
}
exports.TapuKokoVMAX = TapuKokoVMAX;
