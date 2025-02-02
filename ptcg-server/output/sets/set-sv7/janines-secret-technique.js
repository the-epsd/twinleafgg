"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JaninesSecretTechnique = void 0;
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class JaninesSecretTechnique extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'H';
        this.set = 'SV6a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.name = 'Janine\'s Secret Technique';
        this.fullName = 'Janine\'s Secret Technique SV6a';
        this.text = 'Choose up to 2 of your [D] Pokémon. For each of those Pokémon, search your deck for a Basic [D] Energy card and attach it to that Pokémon. Then, shuffle your deck. If you attached any Energy to your Active Pokémon in this way, that Pokémon is now Poisoned.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            let darkPokemonInPlay = false;
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (list, card) => {
                if (card.cardType == card_types_1.CardType.DARK) {
                    darkPokemonInPlay = true;
                }
            });
            if (!darkPokemonInPlay) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const blocked2 = [];
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (card.cardType !== card_types_1.CardType.DARK) {
                    blocked2.push(target);
                }
            });
            // return store.prompt(state, new ChoosePokemonPrompt(
            //   player.id,
            //   GameMessage.ATTACH_ENERGY_TO_BENCH,
            //   PlayerType.BOTTOM_PLAYER,
            //   [SlotType.BENCH, SlotType.ACTIVE],
            //   { min: 0, max: 2, blocked: blocked2 }
            // ), chosen => {
            //   chosen.forEach(target => {
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.deck, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH, play_card_action_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Darkness Energy' }, { allowCancel: false, min: 0, max: 2, blockedTo: blocked2, differentTargets: true }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                    if (target == player.active) {
                        player.active.addSpecialCondition(card_types_1.SpecialCondition.POISONED);
                    }
                }
            });
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.JaninesSecretTechnique = JaninesSecretTechnique;
