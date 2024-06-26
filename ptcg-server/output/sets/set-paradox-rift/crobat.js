"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crobat = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Crobat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [];
        this.evolvesFrom = 'Golbat';
        this.attacks = [{
                name: 'Echoing Madness',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'Choose Item cards or Supporter cards. During your opponent\'s next turn, they can\'t play any of the chosen cards from their hand.'
            }, {
                name: 'Cutting Wind',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 130,
                text: ''
            }];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '112';
        this.name = 'Crobat';
        this.fullName = 'Crobat PAR';
        this.ECHOING_MADNESS_ITEM_LOCK_MARKER = 'ECHOING_MADNESS_ITEM_LOCK_MARKER';
        this.ECHOING_MADNESS_SUPPORTER_LOCK_MARKER = 'ECHOING_MADNESS_SUPPORTER_LOCK_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.player.marker.hasMarker(this.ECHOING_MADNESS_ITEM_LOCK_MARKER) &&
            effect.trainerCard.trainerType === card_types_1.TrainerType.ITEM) {
            throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
        }
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.player.marker.hasMarker(this.ECHOING_MADNESS_SUPPORTER_LOCK_MARKER) &&
            effect.trainerCard.trainerType === card_types_1.TrainerType.SUPPORTER) {
            throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ECHOING_MADNESS_ITEM_LOCK_MARKER)) {
            effect.player.marker.removeMarker(this.ECHOING_MADNESS_ITEM_LOCK_MARKER);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ECHOING_MADNESS_SUPPORTER_LOCK_MARKER)) {
            effect.player.marker.removeMarker(this.ECHOING_MADNESS_SUPPORTER_LOCK_MARKER);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const options = [
                {
                    message: game_message_1.GameMessage.ITEMS,
                    action: () => {
                        opponent.marker.addMarker(this.ECHOING_MADNESS_ITEM_LOCK_MARKER, this);
                        store.log(state, game_message_1.GameLog.LOG_PLAYER_DISABLES_ITEMS_UNTIL_END_OF_NEXT_TURN, { name: player.name, attack: this.attacks[0].name });
                        return state;
                    }
                },
                {
                    message: game_message_1.GameMessage.SUPPORTERS,
                    action: () => {
                        opponent.marker.addMarker(this.ECHOING_MADNESS_SUPPORTER_LOCK_MARKER, this);
                        store.log(state, game_message_1.GameLog.LOG_PLAYER_DISABLES_SUPPORTERS_UNTIL_END_OF_NEXT_TURN, { name: player.name, attack: this.attacks[0].name });
                        return state;
                    }
                }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_message_1.GameMessage.CHOOSE_ITEMS_OR_SUPPORTERS, options.map(c => c.message), { allowCancel: false }), choice => {
                const option = options[choice];
                if (option.action) {
                    option.action();
                }
                return state;
            });
        }
        return state;
    }
}
exports.Crobat = Crobat;
