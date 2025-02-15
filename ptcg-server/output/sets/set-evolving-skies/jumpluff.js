"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jumpluff = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Jumpluff extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Skiploom';
        this.tags = [card_types_1.CardTag.RAPID_STRIKE];
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.powers = [{
                name: 'Fluffy Barrage',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon may attack twice each turn. If the first attack Knocks Out your opponent\'s Active Pokémon,'
                    + ' you may attack again after your opponent chooses a new Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Spinning Attack',
                cost: [card_types_1.CardType.GRASS],
                damage: 60,
                text: ''
            }];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Jumpluff';
        this.fullName = 'Jumpluff EVS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect) {
            if (!prefabs_1.IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
                this.maxAttacksThisTurn = 2;
                this.allowSubsequentAttackChoice = true;
            }
        }
        return state;
    }
}
exports.Jumpluff = Jumpluff;
