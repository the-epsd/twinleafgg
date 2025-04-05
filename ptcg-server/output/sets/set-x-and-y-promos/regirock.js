"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regirock = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Regirock extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 110;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Ω Barrier',
                powerType: game_1.PowerType.ANCIENT_TRAIT,
                text: 'Whenever your opponent plays a Trainer card (excluding Pokémon Tools and Stadium cards), prevent all effects of that card done to this Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Land Maker',
                cost: [F],
                damage: 0,
                text: 'Put 2 Stadium cards from your discard pile into your hand.'
            },
            {
                name: 'Stone Edge',
                cost: [F, F, F, C],
                damage: 80,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 40 more damage.'
            },
        ];
        this.set = 'XYP';
        this.setNumber = '49';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Regirock';
        this.fullName = 'Regirock XYP';
    }
    reduceEffect(store, state, effect) {
        var _a, _b, _c, _d;
        if (effect instanceof play_card_effects_1.TrainerTargetEffect &&
            effect.target &&
            ((_b = (_a = effect.target) === null || _a === void 0 ? void 0 : _a.cards) === null || _b === void 0 ? void 0 : _b.includes(this)) &&
            effect.player !== game_1.StateUtils.findOwner(state, game_1.StateUtils.findCardList(state, this)) && // Ensure the trainer's owner is the opponent
            !(((_c = effect.trainerCard) === null || _c === void 0 ? void 0 : _c.trainerType) === card_types_1.TrainerType.TOOL || ((_d = effect.trainerCard) === null || _d === void 0 ? void 0 : _d.trainerType) === card_types_1.TrainerType.STADIUM)) {
            const targetCard = effect.target.getPokemonCard();
            if (targetCard && targetCard.fullName === this.fullName) {
                effect.target = undefined;
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const stadiumCount = player.discard.cards.filter(c => {
                return c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.STADIUM;
            }).length;
            if (stadiumCount === 0) {
                return state;
            }
            const max = Math.min(2, stadiumCount);
            return store.prompt(state, [
                new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.STADIUM }, { min: 1, max, allowCancel: false })
            ], selected => {
                const cards = selected || [];
                cards.forEach((card, index) => {
                    store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                    player.discard.moveCardsTo(cards, player.hand);
                });
                store.prompt(state, [new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)], () => {
                });
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 40);
        }
        return state;
    }
}
exports.Regirock = Regirock;
