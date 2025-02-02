"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SylveonV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class SylveonV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V, card_types_1.CardTag.RAPID_STRIKE];
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 200;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Dream Gift',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may search your deck for an Item card, reveal it, and put it into your hand. Then, shuffle your deck. If you use this Ability, your turn ends.'
            }
        ];
        this.attacks = [
            {
                name: 'Magical Shot',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.name = 'Sylveon V';
        this.fullName = 'Sylveon V EVS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { min: 0, max: 1, allowCancel: false }), cards => {
                player.deck.moveCardsTo(cards, player.hand);
                state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
                const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                store.reduceEffect(state, endTurnEffect);
                return state;
            });
            return state;
        }
        return state;
    }
}
exports.SylveonV = SylveonV;
