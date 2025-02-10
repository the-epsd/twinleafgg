"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Haunter = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Haunter extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gastly';
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Pain Amplifier',
                cost: [P],
                damage: 0,
                text: 'Put 2 damage counters on each of your opponent\'s Pokémon that has any damage counters on it.'
            }
        ];
        this.set = 'CIN';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.name = 'Haunter';
        this.fullName = 'Haunter CIN';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = effect.opponent;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.damage > 0) {
                    const damage = new attack_effects_1.PutCountersEffect(effect, 20);
                    damage.target = cardList;
                    store.reduceEffect(state, damage);
                }
            });
        }
        return state;
    }
}
exports.Haunter = Haunter;
