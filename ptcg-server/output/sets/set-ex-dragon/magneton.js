"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magneton = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Magneton extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Magnemite';
        this.cardType = L;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Magnetic Field',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), if you have basic Energy cards in your discard pile, you may discard any 1 card from your hand. Then search for up to 2 basic Energy cards from your discard pile, show them to your opponent, and put them into your hand. You can\'t return the card you first discarded to your hand in this way. This power can\'t be used if Magneton is affected by a Special Condition.'
            }];
        this.attacks = [
            {
                name: 'Magnetic Force',
                cost: [L, C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Does 10 damage times the amount of Energy attached to all of your Pokémon (including Magneton).'
            }
        ];
        this.set = 'DR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.name = 'Magneton';
        this.fullName = 'Magneton DR';
        this.MAGNETIC_FIELD_MARKER = 'MAGNETIC_FIELD_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Magnetic Field
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const energyInDiscard = player.discard.cards.filter(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC).length;
            // Must have energy in discard
            if (energyInDiscard === 0) {
                return state;
            }
            // One per turn only
            if (prefabs_1.HAS_MARKER(this.MAGNETIC_FIELD_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            // Cannot use if affected by special conditions
            if (player.active.cards[0] === this && player.active.specialConditions.length > 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: true, min: 1, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                const cardToDiscard = cards[0];
                const max = Math.min(energyInDiscard, 2);
                state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: max, allowCancel: false }), selected => {
                    const cards = selected || [];
                    store.prompt(state, [new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)], () => {
                        player.discard.moveCardsTo(cards, player.hand);
                    });
                    cards.forEach(card => {
                        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                    });
                    // Move the discarded card to the discard pile after energy cards are added to the hand
                    player.hand.moveCardTo(cardToDiscard, player.discard);
                });
                prefabs_1.ADD_MARKER(this.MAGNETIC_FIELD_MARKER, player, this);
                prefabs_1.ABILITY_USED(player, this);
                return state;
            });
            return state;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            let energyCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach(em => {
                    energyCount += em.provides.length;
                });
            });
            effect.damage = energyCount * 10;
            return state;
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.MAGNETIC_FIELD_MARKER, this);
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            prefabs_1.REMOVE_MARKER(this.MAGNETIC_FIELD_MARKER, player, this);
        }
        return state;
    }
}
exports.Magneton = Magneton;
