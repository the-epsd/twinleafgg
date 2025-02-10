"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spiritomb = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Spiritomb extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Lightless World',
                cost: [C],
                damage: 0,
                text: 'Put 2 Supporter cards from your discard pile into your hand.'
            },
            {
                name: 'Terrify',
                cost: [C],
                damage: 10,
                text: 'If the Defending Pokémon is a Basic Pokémon, it can\'t attack during your opponent\'s next turn.'
            },
        ];
        this.set = 'UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.name = 'Spiritomb';
        this.fullName = 'Spiritomb UPR';
        this.TERRIFY_MARKER = 'TERRIFY_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Lightless World
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            let supporterAmount = 0;
            player.discard.cards.forEach(c => {
                if (c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.SUPPORTER) {
                    supporterAmount++;
                }
            });
            if (!supporterAmount) {
                return state;
            }
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 0, max: 2, allowCancel: true }), selected => {
                cards = selected || [];
                cards.forEach(card => {
                    store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                });
                if (cards.length > 0) {
                    prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
                }
                if (cards.length > 0) {
                    player.discard.moveCardsTo(cards, player.hand);
                }
            });
        }
        // Terrify
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const opponent = effect.opponent;
            if (((_a = opponent.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.BASIC) {
                opponent.active.marker.addMarker(this.TERRIFY_MARKER, this);
                opponent.marker.addMarker(this.TERRIFY_MARKER, this);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.marker.hasMarker(this.TERRIFY_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.TERRIFY_MARKER, this)) {
            effect.player.marker.removeMarker(this.TERRIFY_MARKER, this);
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.marker.hasMarker(this.TERRIFY_MARKER, this)) {
                    cardList.marker.removeMarker(this.TERRIFY_MARKER, this);
                }
            });
        }
        return state;
    }
}
exports.Spiritomb = Spiritomb;
