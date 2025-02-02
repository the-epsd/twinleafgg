"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dipplin = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Dipplin extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Applin';
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.canAttackTwice = false;
        this.powers = [{
                name: 'Festival Lead',
                powerType: game_1.PowerType.ABILITY,
                text: 'If Festival Grounds is in play, this Pokémon may use an attack it has twice. If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Do the Wave',
                cost: [card_types_1.CardType.GRASS],
                damage: 20,
                text: 'This attack does 20 damage for each of your Benched Pokémon.'
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
        this.name = 'Dipplin';
        this.fullName = 'Dipplin TWM 18';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const activePokemon = opponent.active.getPokemonCard();
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (activePokemon) {
                const playerBenched = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
                effect.damage = playerBenched * 20;
            }
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
exports.Dipplin = Dipplin;
