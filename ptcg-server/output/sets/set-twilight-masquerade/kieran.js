"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kieran = void 0;
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Kieran extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '154';
        this.regulationMark = 'H';
        this.name = 'Kieran';
        this.fullName = 'Kieran TWM';
        this.KIERAN_MARKER = 'KIERAN_MARKER';
        this.text = `Choose 1:
  
    • Switch your Active Pokémon with 1 of your Benched Pokémon.
    • Your Pokémon's attacks do 30 more damage to your opponent's Active Pokémon ex and Pokémon V this turn.`;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.KIERAN_MARKER, this);
            return state;
        }
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            if (player.marker.hasMarker(this.KIERAN_MARKER, this) && effect.damage > 0 &&
                (opponentActive && opponentActive.tags.includes(card_types_1.CardTag.POKEMON_V) ||
                    opponentActive && opponentActive.tags.includes(card_types_1.CardTag.POKEMON_VMAX) ||
                    opponentActive && opponentActive.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) ||
                    opponentActive && opponentActive.tags.includes(card_types_1.CardTag.POKEMON_ex))) {
                effect.damage += 30; // Increased by 30 more
            }
        }
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const options = [
                {
                    message: game_message_1.GameMessage.SWITCH_POKEMON,
                    action: () => {
                        return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                            const cardList = result[0];
                            player.switchPokemon(cardList);
                            player.supporter.moveCardTo(effect.trainerCard, player.discard);
                            return state;
                        });
                    }
                },
                {
                    message: game_message_1.GameMessage.INCREASE_DAMAGE_BY_30_AGAINST_OPPONENTS_EX_AND_V_POKEMON,
                    action: () => {
                        player.marker.addMarker(this.KIERAN_MARKER, this);
                        player.supporter.moveCardTo(effect.trainerCard, player.discard);
                        return state;
                    }
                }
            ];
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                options.splice(0, 1);
            }
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_message_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        return state;
    }
}
exports.Kieran = Kieran;
