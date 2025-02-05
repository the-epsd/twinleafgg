"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pawmot = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pawmot extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Pawmo';
        this.cardType = L;
        this.hp = 130;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.powers = [{
                name: 'Electrogenesis',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, you may search your deck for a Basic [L] Energy card ' +
                    'and attach it to this Pokémon. Then, shuffle your deck.'
            }];
        this.attacks = [
            { name: 'Electro Paws', cost: [L, L, C], damage: 230, text: 'Discard all Energy from this Pokémon.' },
        ];
        this.set = 'SVI';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.name = 'Pawmot';
        this.fullName = 'Pawmot SVI';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            let blocked = [];
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (card !== this)
                    blocked.push(target);
            });
            prefabs_1.ATTACH_ENERGY_FROM_DECK(store, state, effect.player, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { energyType: game_1.EnergyType.BASIC, name: 'Lightning Energy' }, { blockedTo: blocked });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this))
            prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
        return state;
    }
}
exports.Pawmot = Pawmot;
