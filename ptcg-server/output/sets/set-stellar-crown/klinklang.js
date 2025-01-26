"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Klinklang = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Klinklang extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Klang';
        this.cardType = M;
        this.hp = 140;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Emergency Rotation',
                powerType: game_1.PowerType.ABILITY,
                useFromHand: true,
                text: 'Once during your turn, if this Pokémon is in your hand and your opponent has any Stage 2 Pokémon in play, you may put this Pokémon onto your Bench.'
            }];
        this.attacks = [
            {
                name: 'Hyper Ray',
                cost: [C, C],
                damage: 130,
                text: 'Discard all Energy from this Pokémon.'
            }
        ];
        this.set = 'SCR';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '101';
        this.name = 'Klinklang';
        this.fullName = 'Klinklang SCR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const slots = player.bench.filter(b => b.cards.length === 0);
            if (slots.length === 0) {
                return state;
            }
            let opponentHasStage2 = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (list, card, target) => {
                if (card.stage == card_types_1.Stage.STAGE_2) {
                    opponentHasStage2 = true;
                }
            });
            if (opponentHasStage2) {
                const cards = player.hand.cards.filter(c => c.cards === this.cards);
                cards.forEach((card, index) => {
                    player.hand.moveCardTo(card, slots[index]);
                    slots[index].pokemonPlayedTurn = state.turn;
                });
            }
            else {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
        }
        return state;
    }
}
exports.Klinklang = Klinklang;
