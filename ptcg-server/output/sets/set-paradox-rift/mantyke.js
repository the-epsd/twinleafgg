"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mantyke = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mantyke extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 30;
        this.weakness = [{ type: L }];
        this.retreat = [];
        this.attacks = [
            { name: 'Buoyant Healing', cost: [], damage: 0, text: 'Heal 120 damage from 1 of your Benched Pokémon.' },
        ];
        this.set = 'PAR';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
        this.name = 'Mantyke';
        this.fullName = 'Mantyke PAR';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], {}), (results) => {
                const targets = results || [];
                for (const target of targets) {
                    const healEffect = new game_effects_1.HealEffect(player, target, 120);
                    return store.reduceEffect(state, healEffect);
                }
            });
        }
        return state;
    }
}
exports.Mantyke = Mantyke;
