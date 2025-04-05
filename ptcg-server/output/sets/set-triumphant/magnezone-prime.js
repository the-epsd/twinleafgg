"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magnezone = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const discard_energy_prompt_1 = require("../../game/store/prompts/discard-energy-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magnezone extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Magneton';
        this.tags = [card_types_1.CardTag.PRIME];
        this.cardType = L;
        this.hp = 140;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Magnetic Draw',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may draw cards until you have 6 cards in your hand. This power can\'t be used if Magnezone is affected by a Special Condition.'
            }];
        this.attacks = [
            {
                name: 'Lost Burn',
                cost: [L, C],
                damage: 50,
                damageCalculation: 'x',
                text: 'Put as many Energy cards attached to your Pokémon as you like in the Lost Zone. This attack does 50 damage times the number of Energy cards put in the Lost Zone in this way.'
            }
        ];
        this.set = 'TM';
        this.setNumber = '96';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Magnezone';
        this.fullName = 'Magnezone TM';
        this.MAGNETIC_DRAW_MARKER = 'MAGNETIC_DRAW_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            prefabs_1.REMOVE_MARKER(this.MAGNETIC_DRAW_MARKER, effect.player, this);
        }
        // Magnetic Draw
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.hand.cards.length >= 6) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.active.cards[0] === this && player.active.specialConditions.length > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.MAGNETIC_DRAW_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 6);
            prefabs_1.ADD_MARKER(this.MAGNETIC_DRAW_MARKER, player, this);
            prefabs_1.ABILITY_USED(player, this);
            return state;
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.MAGNETIC_DRAW_MARKER, this);
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            let totalEnergy = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const energyCount = cardList.cards.filter(card => card instanceof game_1.EnergyCard).length;
                totalEnergy += energyCount;
            });
            return store.prompt(state, new discard_energy_prompt_1.DiscardEnergyPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: totalEnergy, allowCancel: false }), transfers => {
                if (transfers === null) {
                    return state;
                }
                // Move all selected energies to lost zone
                transfers.forEach(transfer => {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    source.moveCardTo(transfer.card, player.lostzone);
                });
                // Set damage based on number of discarded cards
                effect.damage = transfers.length * 50;
                return state;
            });
        }
        return state;
    }
}
exports.Magnezone = Magnezone;
