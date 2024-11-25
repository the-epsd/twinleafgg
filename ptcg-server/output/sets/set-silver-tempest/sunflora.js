"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sunflora = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Sunflora extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Sunkern';
        this.regulationMark = 'F';
        this.attacks = [{
                name: 'Bright Beam',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'You may discard up to 3 Energy cards from your hand. This attack does 70 more damage for each card you discarded in this way.'
            }];
        this.set = 'SIT';
        this.fullName = 'Sunflora SIT';
        this.name = 'Sunflora';
        this.setNumber = '6';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard;
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, min: 0, max: 3 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                const damage = cards.length * 70;
                effect.damage += damage;
                player.hand.moveCardsTo(cards, player.discard);
                return state;
            });
        }
        return state;
    }
}
exports.Sunflora = Sunflora;
