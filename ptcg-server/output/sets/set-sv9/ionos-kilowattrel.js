"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IonosKilowattrel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
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
            if (player.hand.cards.length >= 7) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.RUMBLING_ENGINE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const ionosKilowattrelCardList = game_1.StateUtils.findCardList(state, this);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, ionosKilowattrelCardList);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const hasLightningEnergy = checkProvidedEnergy.energyMap.some(energy => energy.provides.includes(card_types_1.CardType.LIGHTNING));
            if (!hasLightningEnergy) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.LIGHTNING], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                cards.forEach(card => {
                    const cardList = game_1.StateUtils.findCardList(state, card);
                    if (cardList) {
                        cardList.moveCardTo(card, player.discard);
                    }
                });
                while (player.hand.cards.length < 6) {
                    if (player.deck.cards.length === 0) {
                        break;
                    }
                    player.deck.moveTo(player.hand, 1);
                }
                player.marker.addMarker(this.RUMBLING_ENGINE_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
            });
        }
        return state;
    }
}
exports.IonosKilowattrel = IonosKilowattrel;
