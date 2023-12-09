"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForestSealStone = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
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
        this.attacks = [
            {
                name: 'Laser Blade',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 200,
                text: ''
            }
        ];
        //       const player = effect.player;
        //       if (player.marker.hasMarker(this.VSTAR_MARKER)) {
        //         throw new GameError(GameMessage.POWER_ALREADY_USED);
        //       }
        //       player.marker.addMarker(this.VSTAR_MARKER, this);
        //       state = store.prompt(state, new ChooseCardsPrompt(
        //         player.id,
        //         GameMessage.CHOOSE_CARD_TO_HAND,
        //         player.deck,
        //         {},
        //         { min: 1, max: 1, allowCancel: false }
        //       ), cards => {
        //         player.deck.moveCardsTo(cards, player.hand);
        //         state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        //           player.deck.applyOrder(order);
        //         });
        //         return state;
        //       });
        //     }
        //     return state;
        //   }
        // }
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.target.tool === this) {
            const pokemon = effect.target.getPokemonCard();
            pokemon.attacks.push(this.attacks[0]);
            return state;
        }
        return state;
    }
}
exports.ForestSealStone = ForestSealStone;
