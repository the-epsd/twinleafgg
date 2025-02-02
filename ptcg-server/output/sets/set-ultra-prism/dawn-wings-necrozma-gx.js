"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DawnWingsNecrozmaGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_2 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_effects_2 = require("../../game/store/effects/game-effects");
// UPR Dawn Wings Necrozma-GX 63 (https://limitlesstcg.com/cards/UPR/63)
class DawnWingsNecrozmaGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX, card_types_1.CardTag.ULTRA_BEAST];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Invasion',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokémon is on your Bench, you may switch it with your Active Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Dark Flash',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 120,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            },
            {
                name: 'Moon\'s Eclipse-GX',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 180,
                text: 'You can use this attack only if you have more Prize cards remaining than your opponent. Prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.INVASION_MARKER = 'INVASION_MARKER';
        this.ECLIPSE_MARKER = 'ECLIPSE_MARKER';
        this.CLEAR_ECLIPSE_MARKER = 'CLEAR_ECLIPSE_MARKER';
        this.set = 'UPR';
        this.setNumber = '63';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dawn Wings Necrozma-GX';
        this.fullName = 'Dawn Wings Necrozma-GX UPR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.INVASION_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            let bench;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (card === this && target.slot === game_1.SlotType.BENCH) {
                    bench = cardList;
                }
            });
            if (bench === undefined) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.INVASION_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            player.marker.addMarker(this.INVASION_MARKER, this);
            player.switchPokemon(bench);
            return state;
        }
        // Dark Flash
        if (effect instanceof game_effects_2.AttackEffect && effect.attack === this.attacks[0]) {
            effect.ignoreResistance = true;
            return state;
        }
        // Moon's Eclipse-GX
        if (effect instanceof game_effects_2.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_2.StateUtils.getOpponent(state, player);
            if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            player.active.marker.addMarker(this.ECLIPSE_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_ECLIPSE_MARKER, this);
        }
        if (effect instanceof attack_effects_1.AbstractAttackEffect
            && effect.target.marker.hasMarker(this.ECLIPSE_MARKER)) {
            effect.preventDefault = true;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.INVASION_MARKER, this);
            if (effect.player.marker.hasMarker(this.CLEAR_ECLIPSE_MARKER, this)) {
                effect.player.marker.removeMarker(this.CLEAR_ECLIPSE_MARKER, this);
                const opponent = game_2.StateUtils.getOpponent(state, effect.player);
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                    cardList.marker.removeMarker(this.ECLIPSE_MARKER, this);
                });
            }
        }
        return state;
    }
}
exports.DawnWingsNecrozmaGX = DawnWingsNecrozmaGX;
