"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Celebi = void 0;
const game_message_1 = require("../../game/game-message");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Celebi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Forest Breath',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), if Celebi is your ' +
                    'Active Pokemon, you may attach a G Energy card from your hand ' +
                    'to 1 of your Pokemon. This power can\'t be used if Celebi is ' +
                    'affected by a Special Condition.'
            }];
        this.attacks = [
            {
                name: 'Time Circle',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'During your opponent\'s next turn, prevent all damage done to ' +
                    'Celebi by attacks from your opponent\'s Stage 1 or Stage 2 Pokemon.'
            }
        ];
        this.set = 'TM';
        this.name = 'Celebi';
        this.fullName = 'Celebi TM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.FOREST_BREATH_MARKER = 'FOREST_BREATH_MARKER';
        this.TIME_CIRCLE_MARKER = 'TIME_CIRCLE_MARKER';
        this.CLEAR_TIME_CIRCLE_MARKER = 'CLEAR_TIME_CIRCLE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.FOREST_BREATH_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList.specialConditions.length > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (cardList !== player.active) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard && c.name === 'Grass Energy';
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.FOREST_BREATH_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, name: 'Grass Energy' }, { allowCancel: true, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                prefabs_1.ABILITY_USED(player, this);
                // cancelled by user
                if (transfers.length === 0) {
                    return;
                }
                player.marker.addMarker(this.FOREST_BREATH_MARKER, this);
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.hand.moveCardTo(transfer.card, target);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.TIME_CIRCLE_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_TIME_CIRCLE_MARKER, this);
            return state;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.target.marker.hasMarker(this.TIME_CIRCLE_MARKER)) {
            const card = effect.source.getPokemonCard();
            const stage = card !== undefined ? card.stage : undefined;
            if (stage === card_types_1.Stage.STAGE_1 || stage === card_types_1.Stage.STAGE_2) {
                effect.preventDefault = true;
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.FOREST_BREATH_MARKER, this);
            if (effect.player.marker.hasMarker(this.CLEAR_TIME_CIRCLE_MARKER, this)) {
                effect.player.marker.removeMarker(this.CLEAR_TIME_CIRCLE_MARKER, this);
                const opponent = game_1.StateUtils.getOpponent(state, effect.player);
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                    cardList.marker.removeMarker(this.TIME_CIRCLE_MARKER, this);
                });
            }
        }
        return state;
    }
}
exports.Celebi = Celebi;
