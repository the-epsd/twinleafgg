"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForestSealStone = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class ForestSealStone extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'SIT';
        this.set2 = 'silvertempest';
        this.setNumber = '156';
        this.regulationMark = 'F';
        this.name = 'Forest Seal Stone';
        this.fullName = 'Forest Seal Stone SIT';
        this.VSTAR_MARKER = 'VSTAR_MARKER';
        this.powers = [{
                name: 'Starbirth',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'During your turn, you may search your deck for a card and put it into ' +
                    'your hand. Then, shuffle your deck. (You can\'t use more than 1 VSTAR' +
                    'Power in a game.)'
            }];
        this.text = 'The Pokemon V this card is attached to can use the VSTAR Power ' +
            'on this card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const attachedPokemon = effect.player.active;
            if (attachedPokemon.tool === this) {
                const player = effect.player;
                if (player.marker.hasMarker(this.VSTAR_MARKER)) {
                    throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
                }
                player.marker.addMarker(this.VSTAR_MARKER, this);
                state = store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 2, allowCancel: false }), cards => {
                    player.deck.moveCardsTo(cards, player.hand);
                    state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                    return state;
                });
            }
            return state;
        }
        return state;
    }
}
exports.ForestSealStone = ForestSealStone;
