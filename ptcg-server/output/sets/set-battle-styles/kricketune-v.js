"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KricketuneV = void 0;
/* eslint-disable indent */
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_1 = require("../../game");
const game_2 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const card_types_2 = require("../../game/store/card/card-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class KricketuneV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_2.CardTag.POKEMON_V];
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Exciting Stage',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, , you may draw cards until you have ' +
                    '3 cards in your hand. If this Pokémon is in the Active Spot, ' +
                    'you may draw cards until you have 4 cards in your hand ' +
                    'instead. You can’t use more than 1 Exciting Stage Ability ' +
                    'each turn.'
            }];
        this.attacks = [
            {
                name: 'X-Scissor',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'Flip a coin. If heads, this attack does 80 more damage.' +
                    ''
            }
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Kricketune V';
        this.fullName = 'Kricketune V BST';
        this.EXCITING_STAGE_MARKER = 'EXCITING_STAGE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.EXCITING_STAGE_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.EXCITING_STAGE_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.EXCITING_STAGE_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.EXCITING_STAGE_MARKER)) {
                throw new game_1.GameError(game_2.GameMessage.POWER_ALREADY_USED);
            }
            player.marker.addMarker(this.EXCITING_STAGE_MARKER, this);
            if (player.active.getPokemonCard() === this) {
                while (player.hand.cards.length < 4) {
                    if (player.deck.cards.length === 0) {
                        break;
                    }
                    player.deck.moveTo(player.hand, 1);
                }
            }
            else {
                while (player.hand.cards.length < 3) {
                    if (player.deck.cards.length === 0) {
                        break;
                    }
                    player.deck.moveTo(player.hand, 1);
                }
            }
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_2.GameMessage.COIN_FLIP)
            ], (results) => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage += 80 * heads;
                return state;
            });
        }
        return state;
    }
}
exports.KricketuneV = KricketuneV;
