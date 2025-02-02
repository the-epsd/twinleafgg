"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenesectV = void 0;
/* eslint-disable indent */
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const card_types_2 = require("../../game/store/card/card-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class GenesectV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_2.CardTag.POKEMON_V, card_types_2.CardTag.FUSION_STRIKE];
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Fusion Strike System',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may draw cards until you have ' +
                    'as many cards in your hand as you have Fusion Strike ' +
                    'Pokémon in play.'
            }];
        this.attacks = [
            {
                name: 'Techno Blast',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 210,
                text: 'During your next turn, this Pokémon can\'t attack. '
            }
        ];
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '185';
        this.name = 'Genesect V';
        this.fullName = 'Genesect V FST';
        this.FUSION_STRIKE_SYSTEM_MARKER = 'FUSION_STRIKE_SYSTEM_MARKER';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(_store, state, effect) {
        var _a, _b;
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            const player = effect.player;
            player.active.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            player.active.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            const player = effect.player;
            player.active.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('second marker added');
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Check marker
            if (player.active.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                console.log('attack blocked');
                throw new game_1.GameError(game_2.GameMessage.BLOCKED_BY_EFFECT);
            }
            player.active.marker.addMarker(this.ATTACK_USED_MARKER, this);
            console.log('marker added');
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.FUSION_STRIKE_SYSTEM_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.FUSION_STRIKE_SYSTEM_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.FUSION_STRIKE_SYSTEM_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.FUSION_STRIKE_SYSTEM_MARKER, this)) {
                throw new game_1.GameError(game_2.GameMessage.POWER_ALREADY_USED);
            }
            let fusionStrikeCount = 0;
            if ((_b = (_a = player.active) === null || _a === void 0 ? void 0 : _a.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(card_types_2.CardTag.FUSION_STRIKE)) {
                fusionStrikeCount++;
            }
            player.bench.forEach(benchSpot => {
                var _a;
                if ((_a = benchSpot.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_2.CardTag.FUSION_STRIKE)) {
                    fusionStrikeCount++;
                }
            });
            while (player.hand.cards.length < fusionStrikeCount) {
                if (player.deck.cards.length === 0) {
                    break;
                }
                player.deck.moveTo(player.hand, 1);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
            }
            player.marker.addMarker(this.FUSION_STRIKE_SYSTEM_MARKER, this);
        }
        return state;
    }
}
exports.GenesectV = GenesectV;
