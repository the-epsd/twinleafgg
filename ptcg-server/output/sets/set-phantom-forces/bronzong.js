"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bronzong = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const state_utils_1 = require("../../game/store/state-utils");
class Bronzong extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bronzor';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Metal Links',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may attach ' +
                    'a M Energy card from your discard pile to 1 of your Benched Pokemon.'
            }];
        this.attacks = [{
                name: 'Hammer In',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            }];
        this.set = 'PHF';
        this.name = 'Bronzong';
        this.fullName = 'Bronzong PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.METAL_LINKS_MARKER = 'METAL_LINKS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.METAL_LINKS_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof energy_card_1.EnergyCard && c.provides.includes(card_types_1.CardType.METAL);
            });
            if (!hasEnergyInDiscard) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.METAL_LINKS_MARKER, this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            const blocked = [];
            player.discard.cards.forEach((card, index) => {
                if (card instanceof energy_card_1.EnergyCard && !card.provides.includes(card_types_1.CardType.METAL)) {
                    blocked.push(index);
                }
            });
            state = store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_CARDS, player.discard, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Metal Energy' }, { allowCancel: false, min: 1, max: 1, blocked }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
                player.marker.addMarker(this.METAL_LINKS_MARKER, this);
                player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
            });
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.METAL_LINKS_MARKER, this);
        }
        return state;
    }
}
exports.Bronzong = Bronzong;
