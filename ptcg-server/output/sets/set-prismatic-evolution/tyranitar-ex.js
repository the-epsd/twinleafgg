"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tyranitarex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Tyranitarex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Pupitar';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = D;
        this.hp = 340;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Grind',
                cost: [C],
                damage: 50,
                damageCalculation: 'x',
                text: 'This attack does 50 damage for each Energy attached to this Pokémon.'
            },
            {
                name: 'Tyranical Crush',
                cost: [D, C, C],
                damage: 150,
                text: 'Discard a random card from your opponent\'s hand.'
            },
        ];
        this.set = 'PRE';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
        this.name = 'Tyranitar ex';
        this.fullName = 'Tyranitar ex PRE';
    }
    reduceEffect(store, state, effect) {
        // Grind
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const energies = player.active.cards.filter(card => card instanceof game_1.EnergyCard);
            effect.damage = 50 * energies.length;
        }
        // Tyranical Crush
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { allowCancel: false, min: 1, max: 1, isSecret: true }), cards => {
                cards = cards || [];
                opponent.hand.moveCardsTo(cards, opponent.discard);
            });
        }
        return state;
    }
}
exports.Tyranitarex = Tyranitarex;
