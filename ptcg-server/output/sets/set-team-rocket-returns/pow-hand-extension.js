"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowHandExtension = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class PowHandExtension extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'TRR';
        this.name = 'Pow! Hand Extension';
        this.fullName = 'Pow! Hand Extension TRR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.text = 'You may use this card only if you have more Prize cards left than your opponent. Move 1 Energy card attached to the Defending Pokémon to another of your opponent\'s Pokémon. Or, switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon.Your opponent chooses the Defending Pokémon to switch.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.getPrizeLeft() < opponent.getPrizeLeft()) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const options = [
                {
                    message: game_1.GameMessage.MOVE_ENERGY_CARDS,
                    action: () => {
                        const hasBench = opponent.bench.some(b => b.cards.length > 0);
                        if (hasBench === false) {
                            return state;
                        }
                        return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, opponent.active, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                            transfers = transfers || [];
                            for (const transfer of transfers) {
                                const target = game_1.StateUtils.getTarget(state, opponent, transfer.to);
                                opponent.active.moveCardTo(transfer.card, target);
                            }
                        });
                    }
                },
                {
                    message: game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH,
                    action: () => {
                        return store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                            if (targets && targets.length > 0) {
                                opponent.active.clearEffects();
                                opponent.switchPokemon(targets[0]);
                                return state;
                            }
                        });
                    }
                }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        return state;
    }
}
exports.PowHandExtension = PowHandExtension;
