"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Genesect = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Genesect extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Ace Canceller',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon has a Pokémon Tool attached, your opponent can\'t play any Ace Spec cards from their hand.'
            }];
        this.attacks = [
            {
                name: 'Magnet Blast',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: ''
            }
        ];
        this.set = 'SFA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Genesect';
        this.fullName = 'Genesect SFA';
        this.OPPONENT_CANNOT_PLAY_ACE_SPECS_MARKER = 'OPPONENT_CANNOT_PLAY_ACE_SPECS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayItemEffect && effect.trainerCard.tags.includes(card_types_1.CardTag.ACE_SPEC)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isGenesectWithToolInPlay = false;
            // player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
            //   if (card === this && cardList.tool !== undefined) {
            //     isGenesectWithToolInPlay = true;
            //   }
            // });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this && cardList.tool !== undefined) {
                    isGenesectWithToolInPlay = true;
                }
            });
            if (!isGenesectWithToolInPlay) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof play_card_effects_1.AttachPokemonToolEffect && effect.trainerCard.tags.includes(card_types_1.CardTag.ACE_SPEC)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isGenesectWithToolInPlay = false;
            // player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
            //   if (card === this && cardList.tool !== undefined) {
            //     isGenesectWithToolInPlay = true;
            //   }
            // });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this && cardList.tool !== undefined) {
                    isGenesectWithToolInPlay = true;
                }
            });
            if (!isGenesectWithToolInPlay) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_b) {
                return state;
            }
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard.tags.includes(card_types_1.CardTag.ACE_SPEC)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isGenesectWithToolInPlay = false;
            // player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
            //   if (card === this && cardList.tool !== undefined) {
            //     isGenesectWithToolInPlay = true;
            //   }
            // });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this && cardList.tool !== undefined) {
                    isGenesectWithToolInPlay = true;
                }
            });
            if (!isGenesectWithToolInPlay) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_c) {
                return state;
            }
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof play_card_effects_1.PlayStadiumEffect && effect.trainerCard.tags.includes(card_types_1.CardTag.ACE_SPEC)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isGenesectWithToolInPlay = false;
            // player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
            //   if (card === this && cardList.tool !== undefined) {
            //     isGenesectWithToolInPlay = true;
            //   }
            // });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this && cardList.tool !== undefined) {
                    isGenesectWithToolInPlay = true;
                }
            });
            if (!isGenesectWithToolInPlay) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_d) {
                return state;
            }
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        return state;
    }
}
exports.Genesect = Genesect;
