"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grusha = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
class Grusha extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '184';
        this.name = 'Grusha';
        this.fullName = 'Grusha PAL';
        this.text = 'Draw cards until you have 5 cards in your hand. If none of your Pokémon have any Energy attached, draw cards until you have 7 cards in your hand instead.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const energyCount = checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);
            if (energyCount === 0) {
                while (player.hand.cards.length < 7) {
                    if (player.deck.cards.length === 0) {
                        break;
                    }
                    player.deck.moveTo(player.hand, 1);
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                }
            }
            else {
                while (player.hand.cards.length < 5) {
                    if (player.deck.cards.length === 0) {
                        break;
                    }
                    player.deck.moveTo(player.hand, 1);
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                }
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.Grusha = Grusha;
