"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Absol = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Absol extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Dark Ambition',
                powerType: game_1.PowerType.ABILITY,
                text: 'If your opponent\'s Active Pokémon is a Basic Pokémon, its Retreat Cost is [C] more.'
            }];
        this.attacks = [{
                name: 'Shadow Seeker',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'This attack does 30 more damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost. '
            }];
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.name = 'Absol';
        this.fullName = 'Absol TEU';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (!game_1.StateUtils.isPokemonInPlay(player, this) || prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this) || !opponent.active.isStage(card_types_1.Stage.BASIC)) {
                return state;
            }
            effect.cost.push(card_types_1.CardType.COLORLESS);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActiveCard = opponent.active.getPokemonCard();
            if (opponentActiveCard) {
                const retreatCost = opponentActiveCard.retreat.filter(c => c === card_types_1.CardType.COLORLESS).length;
                effect.damage += retreatCost * 30;
                return state;
            }
        }
        return state;
    }
}
exports.Absol = Absol;
