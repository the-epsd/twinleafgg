"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hydrapple = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hydrapple extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dipplin';
        this.regulationMark = 'I';
        this.cardType = G;
        this.hp = 170;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Hydra Breath',
                cost: [G],
                damage: 0,
                text: 'Discard 6 Basic [G] Energy from your hand in order to Knock Out your opponent\'s Active Pokémon. If you can\'t discard 6 Basic [G] Energy in this way, this attack does nothing.'
            },
            {
                name: 'Whip Smash',
                cost: [G, C, C],
                damage: 140,
                text: ''
            }
        ];
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
        this.name = 'Hydrapple';
        this.fullName = 'Hydrapple SV9a';
    }
    reduceEffect(store, state, effect) {
        // Hydra Breath
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            let grassEnergies = 0;
            player.hand.cards.forEach(card => {
                if (card instanceof game_1.EnergyCard && card.energyType === card_types_1.EnergyType.BASIC && card.name === 'Grass Energy') {
                    grassEnergies++;
                }
            });
            if (grassEnergies < 6) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Grass Energy' }, { allowCancel: false, min: 6, max: 6 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                player.hand.moveCardsTo(cards, player.discard);
                const dealDamage = new attack_effects_1.KnockOutOpponentEffect(effect, 999);
                dealDamage.target = effect.opponent.active;
                store.reduceEffect(state, dealDamage);
            });
        }
        return state;
    }
}
exports.Hydrapple = Hydrapple;
