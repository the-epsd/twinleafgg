"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Geeta = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Geeta extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '188';
        this.name = 'Geeta';
        this.fullName = 'Geeta OBF';
        this.text = 'Search your deck for up to 2 Basic Energy cards and attach them to 1 of your Pokémon. Then, shuffle your deck. During this turn, your Pokémon can\'t attack. (This includes Pokémon that come into play this turn.)';
        this.GEETA_MARKER = 'GEETA_MARKER';
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
            if (player.deck.cards.length === 0) {
                return state;
            }
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 2, allowCancel: false }), selected => {
                cards = selected || [];
                if (cards.length > 0) {
                    store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: true }), targets => {
                        if (!targets || targets.length === 0) {
                            player.supporter.moveTo(player.discard);
                            return;
                        }
                        const target = targets[0];
                        player.deck.moveCardsTo(cards, target);
                        player.marker.addMarker(this.GEETA_MARKER, this);
                        player.supporter.moveTo(player.discard);
                    });
                }
            });
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.player.marker.hasMarker(this.GEETA_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.GEETA_MARKER, this)) {
            effect.player.marker.removeMarker(this.GEETA_MARKER, this);
        }
        return state;
    }
}
exports.Geeta = Geeta;
