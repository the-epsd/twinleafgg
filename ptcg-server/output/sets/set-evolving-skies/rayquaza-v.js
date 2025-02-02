"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RayquazaV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class RayquazaV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V, card_types_1.CardTag.RAPID_STRIKE];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 210;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Dragon Pulse',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 40,
                text: 'Discard the top 2 cards of your deck.'
            },
            {
                name: 'Spiral Burst',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.LIGHTNING],
                damage: 20,
                text: 'You may discard up to 2 basic [R] Energy or up to 2 basic [L] Energy from this Pokémon. This attack does 80 more damage for each card you discarded in this way.'
            }
        ];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '110';
        this.name = 'Rayquaza V';
        this.fullName = 'Rayquaza V EVS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Discard 4 cards from your deck 
            player.deck.moveTo(player.discard, 2);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const options = [
                {
                    message: game_message_1.GameMessage.ALL_FIRE_ENERGIES,
                    action: () => {
                        store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.active, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { min: 1, max: 2, allowCancel: false }), selected => {
                            const cards = selected || [];
                            if (cards.length > 0) {
                                let totalDiscarded = 0;
                                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                                discardEnergy.target = player.active;
                                totalDiscarded += discardEnergy.cards.length;
                                effect.damage = (totalDiscarded * 80) + 20;
                                store.reduceEffect(state, discardEnergy);
                            }
                        });
                    }
                },
                {
                    message: game_message_1.GameMessage.ALL_LIGHTNING_ENERGIES,
                    action: () => {
                        store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.active, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Lightning Energy' }, { min: 1, max: 2, allowCancel: false }), selected => {
                            const cards = selected || [];
                            if (cards.length > 0) {
                                let totalDiscarded = 0;
                                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                                discardEnergy.target = player.active;
                                totalDiscarded += discardEnergy.cards.length;
                                effect.damage = (totalDiscarded * 80) + 20;
                                store.reduceEffect(state, discardEnergy);
                            }
                        });
                    }
                }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_message_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        return state;
    }
}
exports.RayquazaV = RayquazaV;
