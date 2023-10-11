"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jirachi = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Jirachi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Stellar Veil',
                powerType: game_1.PowerType.ABILITY,
                text: 'Attacks from your opponent\'s Basic Pokémon can\'t put damage counters on your Benched Pokémon.'
            }
        ];
        this.attacks = [{
                name: 'Charge Energy',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for up to 2 Basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.'
            }
        ];
        this.set = 'PAR';
        this.set2 = 'ragingsurf';
        this.setNumber = '42';
        this.name = 'Jirachi';
        this.fullName = 'Jirachi PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            // Override reduceEffect
            store.reduceEffect = (state, effect) => {
                // Check if effect is a damage effect
                if (effect instanceof attack_effects_1.PutDamageEffect || effect instanceof game_effects_1.AttackEffect && effect.target === player.bench) {
                    effect.damage = 0;
                }
                // Call original reduceEffect 
                return this.reduceEffect(store, state, effect);
            };
        }
        return state;
    }
}
exports.Jirachi = Jirachi;
