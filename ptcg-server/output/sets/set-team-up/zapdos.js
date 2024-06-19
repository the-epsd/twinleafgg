"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zapdos = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Zapdos extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Thunderous Assault',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 10,
                text: 'If this Pokémon was on the Bench and became your Active Pokémon this turn, this attack does 70 more damage. This attack\'s damage isn\'t affected by Weakness.'
            }
        ];
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Zapdos';
        this.fullName = 'Zapdos TEU';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.movedToActiveThisTurn = false;
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.getPokemonCard() !== this) {
            this.movedToActiveThisTurn = true;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.ignoreWeakness = true;
            if (this.movedToActiveThisTurn) {
                effect.damage += 70;
            }
        }
        return state;
    }
}
exports.Zapdos = Zapdos;
