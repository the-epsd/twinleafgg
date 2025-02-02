"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Malamar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const energy_card_1 = require("../../game/store/card/energy-card");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const state_utils_1 = require("../../game/store/state-utils");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Malamar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Inkay';
        this.powers = [{
                name: 'Psychic Recharge',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may attach a P Energy card from your discard pile to 1 of your Benched Pokémon.'
            }];
        this.attacks = [{
                name: 'Psychic Sphere',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            }];
        this.set = 'FLI';
        this.name = 'Malamar';
        this.fullName = 'Malamar FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
        this.PSYCHIC_RECHARGE_MARKER = 'PSYCHIC_RECHARGE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.PSYCHIC_RECHARGE_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof energy_card_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.PSYCHIC);
            });
            if (!hasEnergyInDiscard) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.PSYCHIC_RECHARGE_MARKER, this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            state = store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Psychic Energy' }, { allowCancel: true, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return;
                }
                player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                player.marker.addMarker(this.PSYCHIC_RECHARGE_MARKER, this);
                for (const transfer of transfers) {
                    const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.PSYCHIC_RECHARGE_MARKER, this)) {
            effect.player.marker.removeMarker(this.PSYCHIC_RECHARGE_MARKER, this);
        }
        return state;
    }
}
exports.Malamar = Malamar;
