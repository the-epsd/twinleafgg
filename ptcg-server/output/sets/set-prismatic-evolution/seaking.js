"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seaking = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Seaking extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Goldeen';
        this.cardType = W;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.canAttackTwice = false;
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
        this.fullName = 'Seaking SV8a';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            player.deck.moveTo(player.hand, 2);
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            // Check if 'Festival Plaza' stadium is in play
            if (stadiumCard && stadiumCard.name === 'Festival Grounds') {
                this.canAttackTwice = true;
            }
            else {
                this.canAttackTwice = false;
            }
            // Increment attacksThisTurn
            player.active.attacksThisTurn = (player.active.attacksThisTurn || 0) + 1;
        }
        return state;
    }
}
exports.Seaking = Seaking;
