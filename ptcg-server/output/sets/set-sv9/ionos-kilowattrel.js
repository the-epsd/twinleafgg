"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IonosKilowattrel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class IonosKilowattrel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Iono\'s Wattrel';
        this.tags = [card_types_1.CardTag.IONOS];
        this.cardType = L;
        this.hp = 120;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Flash Draw',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'You must discard a Basic L Energy from this Pokémon in order to use this Ability. Once during your turn, you may draw cards until you have 6 cards in your hand.'
            }];
        this.attacks = [{
                name: 'Mach Bolt',
                cost: [L, C, C],
                damage: 70,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'SV9';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
        this.name = 'Iono\'s Kilowattrel';
        this.fullName = 'Iono\'s Kilowattrel SV9';
        this.RUMBLING_ENGINE_MARKER = 'RUMBLING_ENGINE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.RUMBLING_ENGINE_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.RUMBLING_ENGINE_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.hand.cards.length >= 6) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.RUMBLING_ENGINE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const cardList = game_1.StateUtils.findCardList(state, this);
            const lightningEnergy = cardList.cards.filter(c => c instanceof game_1.EnergyCard && c.superType === card_types_1.SuperType.ENERGY &&
                c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Lightning Energy');
            if (lightningEnergy.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // If we have exactly 1 basic L energy attached, do it without a prompt
            if (lightningEnergy.length === 1) {
                lightningEnergy.forEach(card => cardList.moveCardTo(card, player.discard));
                prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 6);
                prefabs_1.ADD_MARKER(this.RUMBLING_ENGINE_MARKER, player, this);
                prefabs_1.ABILITY_USED(player, this);
                return state;
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, cardList, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Lightning Energy' }, { allowCancel: true, min: 0, max: 1 }), energy => {
                if (energy === null || energy.length === 0) {
                    return state;
                }
                energy.forEach(card => cardList.moveCardTo(card, player.discard));
                prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 6);
                prefabs_1.ADD_MARKER(this.RUMBLING_ENGINE_MARKER, player, this);
                prefabs_1.ABILITY_USED(player, this);
            });
        }
        return state;
    }
}
exports.IonosKilowattrel = IonosKilowattrel;
