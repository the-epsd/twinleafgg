"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Squawkabillyex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
class Squawkabillyex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 160;
        this.weakness = [{
                type: card_types_1.CardType.LIGHTNING
            }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Squawk and Seize',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your first turn, you may discard your hand and draw 6 cards. You can\'t use more than 1 Squawk and Seize Ability during your turn.'
            }];
        this.attacks = [{
                name: 'Motivate',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Attach up to 2 Basic Energy cards from your discard pile to 1 of your Benched Pokémon.'
            }];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '169';
        this.name = 'Squawkabilly ex';
        this.fullName = 'Squawkabilly ex PAL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            // Get current turn
            const turn = state.turn;
            // Check if it is player's first turn
            if (turn > 2) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            else {
                if (player.usedSquawkAndSeizeThisTurn) {
                    throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
                }
                // Discard hand and draw cards
                player.hand.moveTo(player.discard);
                // Draw 6 cards
                player.deck.moveTo(player.hand, 6);
                // Mark power as used this turn
                player.usedSquawkAndSeizeThisTurn = true;
                // Return updated state
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC;
            });
            if (!hasEnergyInDiscard) {
                return state;
            }
            if (!hasBench) {
                return state;
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max: 2, sameTarget: true }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
            return state;
        }
        return state;
    }
}
exports.Squawkabillyex = Squawkabillyex;
