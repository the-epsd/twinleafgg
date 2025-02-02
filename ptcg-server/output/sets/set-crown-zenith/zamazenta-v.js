"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZamazentaV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class ZamazentaV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 220;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Regal Stance',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may discard your hand and draw 5 cards. If you use this Ability, your turn ends.'
            }];
        this.attacks = [
            {
                name: 'Revenge Blast',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each Prize card your opponent has taken.'
            },
        ];
        this.set = 'CRZ';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '98';
        this.name = 'Zamazenta V';
        this.fullName = 'Zamazenta V CRZ';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.hand.moveTo(player.discard);
            player.deck.moveTo(player.hand, 5);
            const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
            store.reduceEffect(state, endTurnEffect);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const prizesTaken = 6 - opponent.getPrizeLeft();
            const damagePerPrize = 30;
            effect.damage += prizesTaken * damagePerPrize;
        }
        return state;
    }
}
exports.ZamazentaV = ZamazentaV;
