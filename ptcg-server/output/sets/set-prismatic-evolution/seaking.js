"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seaking = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Seaking extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Goldeen';
        this.cardType = W;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Festival Lead',
                powerType: game_1.PowerType.ABILITY,
                text: 'If Festival Grounds is in play, this Pokémon may use an attack it has twice. If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Rapid Draw',
                cost: [C],
                damage: 60,
                text: 'Draw 2 cards.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'PRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Seaking';
        this.fullName = 'Seaking PRE';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && this.attacks.includes(effect.attack)) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard && stadiumCard.name === 'Festival Grounds' && !prefabs_1.IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
                this.maxAttacksThisTurn = 2;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            prefabs_1.DRAW_CARDS(effect.player, 2);
        }
        return state;
    }
}
exports.Seaking = Seaking;
