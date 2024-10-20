"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Luxray = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Luxray extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Luxio';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Swelling Flash',
                powerType: game_1.PowerType.ABILITY,
                useFromHand: true,
                text: 'Once during your turn, if this Pokémon is in your hand and you have more Prize cards remaining than your opponent, you may put this Pokémon onto your Bench.'
            }];
        this.attacks = [{
                name: 'Wild Charge',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 180,
                text: 'This Pokémon also does 20 damage to itself.'
            }];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Luxray';
        this.fullName = 'Luxray PAL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect
            && effect.power.powerType === game_1.PowerType.ABILITY) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const slots = player.bench.filter(b => b.cards.length === 0);
            if (player.getPrizeLeft() > opponent.getPrizeLeft()) {
                // Check if bench has open slots
                const openSlots = player.bench.filter(b => b.cards.length === 0);
                if (openSlots.length === 0) {
                    // No open slots, throw error
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                }
                state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                    if (wantToUse) {
                        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                            if (cardList.getPokemonCard() === this) {
                                store.log(state, game_1.GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: 'Swelling Flash' });
                            }
                        });
                        const card = this;
                        player.hand.moveCardTo(card, slots[0]);
                        slots[0].pokemonPlayedTurn = state.turn;
                        store.log(state, game_1.GameLog.LOG_PLAYER_PLAYS_BASIC_POKEMON, { name: player.name, card: card.name });
                        return state;
                    }
                });
            }
        }
        return state;
    }
}
exports.Luxray = Luxray;
