"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GengarMimikyuGX = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class GengarMimikyuGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_GX, game_1.CardTag.TAG_TEAM];
        this.cardType = P;
        this.hp = 240;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Poltergeist',
                cost: [P, P],
                damage: 50,
                damageCalculation: 'x',
                text: 'Your opponent reveals their hand. This attack does 50 damage for each Trainer card you find there.'
            },
            {
                name: 'Horror House-GX',
                cost: [P],
                damage: 0,
                gxAttack: true,
                text: 'Your opponent can\'t play any cards from their hand during their next turn. If this Pokémon has at least 1 extra [P] Energy attached to it (in addition to this attack\'s cost), each player draws cards until they have 7 cards in their hand. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'TEU';
        this.name = 'Gengar & Mimikyu-GX';
        this.fullName = 'Gengar & Mimikyu-GX TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.CANNOT_PLAY_CARDS_FROM_HAND_MARKER = 'CANT_PLAY_CARDS_FROM_HAND_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const trainerCount = opponent.hand.cards.filter(card => card instanceof game_1.TrainerCard).length;
            effect.damage = 50 * trainerCount;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.marker.addMarker(this.CANNOT_PLAY_CARDS_FROM_HAND_MARKER, this);
            const extraEnergy = player.active.cards.filter(card => card instanceof game_1.EnergyCard && card.provides.includes(game_1.CardType.PSYCHIC)).length > 1;
            if (extraEnergy) {
                [player, opponent].forEach(p => {
                    while (p.hand.cards.length < 7) {
                        p.deck.moveTo(p.hand);
                    }
                });
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CANNOT_PLAY_CARDS_FROM_HAND_MARKER)) {
            effect.player.marker.removeMarker(this.CANNOT_PLAY_CARDS_FROM_HAND_MARKER);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.player.marker.hasMarker(this.CANNOT_PLAY_CARDS_FROM_HAND_MARKER)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof play_card_effects_1.PlayItemEffect && effect.player.marker.hasMarker(this.CANNOT_PLAY_CARDS_FROM_HAND_MARKER)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.player.marker.hasMarker(this.CANNOT_PLAY_CARDS_FROM_HAND_MARKER)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof play_card_effects_1.PlaySupporterEffect && effect.player.marker.hasMarker(this.CANNOT_PLAY_CARDS_FROM_HAND_MARKER)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof play_card_effects_1.PlayStadiumEffect && effect.player.marker.hasMarker(this.CANNOT_PLAY_CARDS_FROM_HAND_MARKER)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof play_card_effects_1.AttachPokemonToolEffect && effect.player.marker.hasMarker(this.CANNOT_PLAY_CARDS_FROM_HAND_MARKER)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        return state;
    }
}
exports.GengarMimikyuGX = GengarMimikyuGX;
