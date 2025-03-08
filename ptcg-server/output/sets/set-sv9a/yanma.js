"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yanma = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Yanma extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Whirlwind',
                cost: [C],
                damage: 0,
                text: 'Switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)'
            },
            {
                name: 'Razor Wing',
                cost: [G, C],
                damage: 30,
                text: ''
            },
        ];
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.name = 'Yanma';
        this.fullName = 'Yanma SV9a';
    }
    reduceEffect(store, state, effect) {
        // Whirlwind
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = effect.opponent;
            // Check if opponent has any benched Pokemon
            if (!opponent.bench.some(b => b.cards.length > 0)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (targets && targets.length > 0) {
                    opponent.active.clearEffects();
                    opponent.switchPokemon(targets[0]);
                    return state;
                }
            });
        }
        return state;
    }
}
exports.Yanma = Yanma;
