"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goldeen = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Goldeen extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'H';
        this.cardType = W;
        this.hp = 50;
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
                name: 'Whirlpool',
                cost: [C, C],
                damage: 60,
                text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Goldeen';
        this.fullName = 'Goldeen TWM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            // Defending Pokemon has no energy cards attached
            if (!opponent.active.cards.some(c => c instanceof game_1.EnergyCard)) {
                return state;
            }
            state = store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    let card;
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                        card = selected[0];
                        opponent.active.moveCardTo(card, opponent.discard);
                    });
                }
            });
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
exports.Goldeen = Goldeen;
