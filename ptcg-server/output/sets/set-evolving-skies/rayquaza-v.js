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
            let pokemons = 0;
            let trainers = 0;
            const blocked = [];
            player.active.cards.forEach((c, index) => {
                if (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Basic Fire Energy') {
                    trainers += 1;
                }
                else if (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Basic Lightning Energy') {
                    pokemons += 1;
                }
                else {
                    blocked.push(index);
                }
            });
            // We will discard this card after prompt confirmation
            // This will prevent unblocked supporter to appear in the discard pile
            effect.preventDefault = true;
            const maxPokemons = Math.min(pokemons, 2);
            const maxTrainers = Math.min(trainers, 2);
            const count = maxPokemons || maxTrainers;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, player.active, // Card source is target Pokemon
            { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxTrainers }), selected => {
                const cards = selected || [];
                let totalDiscarded = 0;
                cards.forEach(target => {
                    const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                    discardEnergy.target = player.active;
                    totalDiscarded = discardEnergy.cards.length;
                    store.reduceEffect(state, discardEnergy);
                    effect.damage = (totalDiscarded * 80) + this.attacks[0].damage;
                });
                return state;
            });
        }
        return state;
    }
}
exports.RayquazaV = RayquazaV;
