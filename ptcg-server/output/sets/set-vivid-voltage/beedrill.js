"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeedrillVIV = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class BeedrillVIV extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kakuna';
        this.cardType = game_1.CardType.GRASS;
        this.hp = 130;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [];
        this.set = 'VIV';
        this.setNumber = '3';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Beedrill';
        this.fullName = 'Beedrill VIV';
        this.regulationMark = 'D';
        this.powers = [
            {
                name: 'Elusive Master',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokemon is the last card in your hand, you may play it onto your Bench. If you do, draw 3 cards.'
            }
        ];
        this.attacks = [{ name: 'Sharp Sting', cost: [game_1.CardType.GRASS, game_1.CardType.COLORLESS], damage: 120, text: '' }];
    }
    reduceEffect(store, state, effect) {
        // Elusive Master
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this && effect.target.cards.length === 0) {
            const player = effect.player;
            // Can't bench this Pokemon unless its our last card in our hand.
            if (player.hand.cards.filter(c => c !== this).length !== 0) {
                return state;
            }
            // Bench this Pokemon to the desired slot.
            effect.preventDefault = true; // this might prevent errors from trying to bench a stage 2 idk
            store.log(state, game_1.GameLog.LOG_PLAYER_PLAYS_BASIC_POKEMON, { name: player.name, card: this.name });
            player.hand.moveCardTo(this, effect.target);
            effect.target.pokemonPlayedTurn = state.turn;
            // Then, draw 3 cards.
            player.deck.moveTo(player.hand, 3);
            return state;
        }
        return state;
    }
}
exports.BeedrillVIV = BeedrillVIV;
