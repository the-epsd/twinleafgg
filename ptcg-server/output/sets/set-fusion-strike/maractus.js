"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maractus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Maractus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [
            { name: 'Venomous Hit', cost: [G], damage: 20, text: '' },
            {
                name: 'Ditch and Shake',
                cost: [G, C],
                damage: 50,
                damageCalculation: 'x',
                text: 'Discard any number of Pokémon Tool cards from your hand. ' +
                    'This attack does 50 damage for each card you discarded in this way. '
            },
        ];
        this.set = 'FST';
        this.name = 'Maractus';
        this.fullName = 'Maractus FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.regulationMark = 'E';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
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
        return state;
    }
}
exports.Maractus = Maractus;
