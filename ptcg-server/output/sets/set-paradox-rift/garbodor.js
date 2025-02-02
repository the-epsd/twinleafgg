"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Garbodor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Garbodor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Trubbish';
        this.cardType = D;
        this.hp = 120;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Suffocating Gas',
                cost: [D],
                damage: 50,
                damageCalculation: 'x',
                text: 'Discard any number of Pokémon Tool cards from your hand. ' +
                    'This attack does 50 damage for each card you discarded in this way. '
            },
            {
                name: 'Venomous Hit',
                cost: [D, C, C],
                damage: 30,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.'
            },
        ];
        this.set = 'PAR';
        this.name = 'Garbodor';
        this.fullName = 'Garbodor PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '117';
        this.regulationMark = 'G';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const blocked = player.hand.cards
                .filter(c => c instanceof game_1.TrainerCard && c.trainerType !== card_types_1.TrainerType.TOOL)
                .map(c => player.hand.cards.indexOf(c));
            // Prompt player to choose cards to discard 
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.TRAINER }, { allowCancel: false, min: 0, blocked }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
                player.hand.moveCardsTo(cards, player.discard);
                // Calculate damage
                const damage = cards.length * 50;
                effect.damage = damage;
                return state;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Garbodor = Garbodor;
