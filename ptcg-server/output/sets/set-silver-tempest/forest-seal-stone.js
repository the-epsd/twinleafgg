"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForestSealStone = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class ForestSealStone extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '156';
        this.regulationMark = 'F';
        this.name = 'Forest Seal Stone';
        this.fullName = 'Forest Seal Stone SIT';
        this.useWhenAttached = true;
        this.VSTAR_MARKER = 'VSTAR_MARKER';
        this.powers = [
            {
                name: 'Star Alchemy',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                exemptFromAbilityLock: true,
                text: 'The Pokémon V this card is attached to can use the VSTAR Power on this card.' +
                    '' +
                    'During your turn, you may search your deck for a card and put it into your hand. Then, shuffle your deck. (You can\'t use more than 1 VSTAR Power in a game.) '
            }
        ];
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckPokemonPowersEffect && effect.target.cards.includes(this) &&
            !effect.powers.find(p => p.name === this.powers[0].name)) {
            const player = effect.player;
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_b) {
                return state;
            }
            if (!((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_V || card_types_1.CardTag.POKEMON_VMAX || card_types_1.CardTag.POKEMON_VSTAR))) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            effect.powers.push(this.powers[0]);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.usedVSTAR === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_VSTAR_USED);
            }
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_c) {
                return state;
            }
            player.usedVSTAR = true;
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 1, allowCancel: false }), cards => {
                player.deck.moveCardsTo(cards, player.hand);
                state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
                return state;
            });
            return state;
        }
        return state;
    }
}
exports.ForestSealStone = ForestSealStone;
