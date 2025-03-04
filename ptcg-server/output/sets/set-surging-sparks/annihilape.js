"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Annihilape = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Annihilape extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Primeape';
        this.cardType = F;
        this.hp = 140;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [
            { name: 'Tantrum', cost: [F], damage: 130, text: 'This Pokémon is now Confused.' },
            { name: 'Destined Fight', cost: [F, C], damage: 0, text: 'Both Active Pokémon are Knocked Out.' },
        ];
        this.set = 'SSP';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '100';
        this.name = 'Annihilape';
        this.fullName = 'Annihilape SSP';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.player, this);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Knock out both active Pokemon
            player.active.damage += 999;
            const dealDamage = new attack_effects_1.KnockOutOpponentEffect(effect, 999);
            dealDamage.target = opponent.active;
            store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.Annihilape = Annihilape;
