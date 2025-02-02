"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuxrayV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class LuxrayV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Fang Snipe',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Your opponent reveals their hand. Discard a Trainer card you find there.'
            },
            {
                name: 'Radiating Pulse',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'Discard 2 Energy from this Pokémon. Your opponent\'s Active Pokémon is now Paralyzed.'
            }
        ];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.name = 'Luxray V';
        this.fullName = 'Luxray V ASR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const cards = opponent.hand.cards.filter(c => c instanceof game_1.TrainerCard);
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false }), selected => {
                selected = cards || [];
                opponent.hand.moveCardsTo(cards, opponent.discard);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            state = store.reduceEffect(state, checkProvidedEnergy);
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.active, { superType: card_types_1.SuperType.ENERGY }, { min: 2, max: 2, allowCancel: false }), selected => {
                selected = selected || [];
                player.active.moveCardsTo(selected, player.discard);
            });
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
            store.reduceEffect(state, specialConditionEffect);
            return state;
        }
        return state;
    }
}
exports.LuxrayV = LuxrayV;
