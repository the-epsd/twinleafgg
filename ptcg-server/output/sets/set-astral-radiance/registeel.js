"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registeel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Registeel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Regi Gate',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Then, shuffle your deck.'
            },
            {
                name: 'Heavy Slam',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 220,
                text: 'This attack does 50 less damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost.'
            }
        ];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.set2 = 'astralradiance';
        this.setNumber = '108';
        this.name = 'Registeel';
        this.fullName = 'Registeel ASR';
        //   public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
        //     if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
        //       const player = effect.player;
        //       const opponent = state.getOpponent(player);
        //       let retreatCost = 0;
        //       if (opponent.active) {
        //         retreatCost = opponent.active.getRetreatCost();
        //       }
        //       effect.damage -= retreatCost * 50;
        //       if (effect.damage < 0) {
        //         effect.damage = 0;
        //       }
        //     }
        //     return state;
        //   }
    }
}
exports.Registeel = Registeel;
