"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Koraidon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const card_types_2 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Koraidon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_2.CardTag.ANCIENT];
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 130;
        this.retreat = [C, C];
        this.weakness = [{ type: P }];
        this.attacks = [
            {
                name: 'Unrelenting Onslaught',
                cost: [C, C],
                damage: 30,
                damageCalculator: '+',
                text: 'If 1 of your other Ancient Pokémon used an attack during your last turn, this attack does 150 more damage.'
            },
            {
                name: 'Hammer In',
                cost: [F, F, C],
                damage: 110,
                text: ''
            }
        ];
        this.set = 'SSP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '116';
        this.name = 'Koraidon';
        this.fullName = 'Koraidon SSP';
        this.UNRELENTING_ONSLAUGHT_MARKER = 'UNRELENTING_ONSLAUGHT_MARKER';
        this.UNRELENTING_ONSLAUGHT_2_MARKER = 'UNRELENTING_ONSLAUGHT_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            effect.player.marker.removeMarker(this.UNRELENTING_ONSLAUGHT_MARKER, this);
            console.log('marker removed');
            effect.player.marker.removeMarker(this.UNRELENTING_ONSLAUGHT_2_MARKER, this);
            console.log('marker 2 removed');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.UNRELENTING_ONSLAUGHT_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.UNRELENTING_ONSLAUGHT_MARKER, this);
            effect.player.marker.removeMarker(this.UNRELENTING_ONSLAUGHT_2_MARKER, this);
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.UNRELENTING_ONSLAUGHT_MARKER, this)) {
            effect.player.marker.addMarker(this.UNRELENTING_ONSLAUGHT_2_MARKER, this);
            console.log('second marker added');
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const playerLastAttack = (_a = state.playerLastAttack) === null || _a === void 0 ? void 0 : _a[player.id];
            const originalCard = playerLastAttack ? this.findOriginalCard(state, playerLastAttack) : null;
            if (originalCard && originalCard.tags.includes(card_types_2.CardTag.ANCIENT) && !player.marker.hasMarker(this.UNRELENTING_ONSLAUGHT_MARKER)) {
                effect.damage += 150;
                console.log('marker added');
            }
            player.marker.addMarker(this.UNRELENTING_ONSLAUGHT_MARKER, this);
        }
        return state;
    }
    findOriginalCard(state, playerLastAttack) {
        let originalCard = null;
        state.players.forEach(player => {
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.attacks.some(attack => attack === playerLastAttack)) {
                    originalCard = card;
                }
            });
            // Check deck, discard, hand, and lost zone
            [player.deck, player.discard, player.hand, player.lostzone].forEach(cardList => {
                cardList.cards.forEach(card => {
                    if (card instanceof pokemon_card_1.PokemonCard && card.attacks.some(attack => attack === playerLastAttack)) {
                        originalCard = card;
                    }
                });
            });
        });
        return originalCard;
    }
}
exports.Koraidon = Koraidon;
