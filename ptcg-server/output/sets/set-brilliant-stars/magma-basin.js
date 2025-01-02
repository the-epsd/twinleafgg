"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagmaBasin = void 0;
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class MagmaBasin extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.regulationMark = 'F';
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '144';
        this.name = 'Magma Basin';
        this.fullName = 'Magma Basin BRS';
        this.text = 'Once during each player\'s turn, that player may attach a [R] Energy card from their discard pile to 1 of their Benched [R] Pokémon. If a player attached Energy to a Pokémon in this way, put 2 damage counters on that Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const hasFirePokemonOnBench = player.bench.some(b => b.cards.some(c => c instanceof game_1.PokemonCard && c.cardType === card_types_1.CardType.FIRE));
            if (!hasFirePokemonOnBench) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const blocked2 = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (card.cardType !== card_types_1.CardType.FIRE) {
                    blocked2.push(target);
                }
            });
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard && c.name == 'Fire Energy';
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { allowCancel: false, min: 1, max: 1, blockedTo: blocked2 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                    // const pokemonCard = target.cards[0] as PokemonCard;
                    // if (pokemonCard.cardType !== CardType.FIRE) {
                    //   throw new GameError(GameMessage.INVALID_TARGET);
                    // }
                    player.discard.moveCardTo(transfer.card, target);
                    target.damage += 20;
                }
                return state;
            });
            return state;
        }
        return state;
    }
}
exports.MagmaBasin = MagmaBasin;
