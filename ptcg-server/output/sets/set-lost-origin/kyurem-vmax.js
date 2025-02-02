"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KyuremVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class KyuremVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VMAX;
        this.tags = [card_types_1.CardTag.POKEMON_VMAX];
        this.evolvesFrom = 'Kyurem V';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 330;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Glaciated World',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, you may discard the top card of your deck. If that card is a [W] Energy card, attach it to 1 of your Pokémon.'
            }];
        this.attacks = [{
                name: 'Max Frost',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 120,
                damageCalculation: '+',
                text: 'You may discard any amount of [W] Energy from this Pokémon. This attack does 50 more damage for each card you discarded in this way.'
            }];
        this.set = 'LOR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '49';
        this.name = 'Kyurem VMAX';
        this.fullName = 'Kyurem VMAX LOR';
        this.GLACIATED_WORLD_MARKER = 'GLACIATED_WORLD_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.GLACIATED_WORLD_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.GLACIATED_WORLD_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Prompt player to choose cards to discard 
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.active, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0 }), cards => {
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
                effect.damage += damage;
                return state;
            });
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const temp = new game_1.CardList();
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.GLACIATED_WORLD_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            player.deck.moveTo(temp, 1);
            // Check if any cards drawn are basic energy
            const energyCardsDrawn = temp.cards.filter(card => {
                return card instanceof game_1.EnergyCard && card.energyType === card_types_1.EnergyType.BASIC && card.name === 'Water Energy';
            });
            // If no energy cards were drawn, move all cards to discard
            if (energyCardsDrawn.length == 0) {
                player.marker.addMarker(this.GLACIATED_WORLD_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                temp.cards.slice(0, 1).forEach(card => {
                    store.prompt(state, [new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, temp.cards)], () => {
                        temp.moveTo(player.discard);
                    });
                });
            }
            else {
                // Prompt to attach energy if any were drawn
                return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, temp, // Only show drawn energies
                game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: energyCardsDrawn.length, allowCancel: false }), transfers => {
                    player.marker.addMarker(this.GLACIATED_WORLD_MARKER, this);
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        if (cardList.getPokemonCard() === this) {
                            cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                        }
                    });
                    // Attach energy based on prompt selection
                    if (transfers) {
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            temp.moveCardTo(transfer.card, target); // Move card to target
                        }
                        temp.cards.forEach(card => {
                            temp.moveCardTo(card, player.hand); // Move card to hand
                        });
                    }
                });
            }
        }
        return state;
    }
}
exports.KyuremVMAX = KyuremVMAX;
