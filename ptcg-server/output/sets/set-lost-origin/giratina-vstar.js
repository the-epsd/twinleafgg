"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiratinaVSTAR = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class GiratinaVSTAR extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VSTAR;
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.evolvesFrom = 'Giratina V';
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 280;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Lost Impact',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 280,
                text: 'Put 2 Energy attached to your Pokémon in the Lost Zone.'
            },
            {
                name: 'Star Requium',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'You can use this attack only if you have 10 or more cards in the Lost Zone. Your opponent\'s Active Pokémon is Knocked Out. (You can\'t use more than 1 VSTAR Power in a game.)'
            }
        ];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '131';
        this.name = 'Giratina VSTAR';
        this.fullName = 'Giratina VSTAR LOR';
        this.VSTAR_MARKER = 'VSTAR_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.VSTAR_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (targets && targets.length > 0) {
                    const target = targets[0];
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, target, // Card source is target Pokemon
                    { superType: card_types_1.SuperType.ENERGY }, { min: 2, max: 2, allowCancel: false }), selected => {
                        const cards = selected || [];
                        if (cards.length > 0) {
                            target.moveCardsTo(cards, player.lostzone);
                        }
                    });
                }
            });
        }
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.lostzone.cards.length <= 9) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.VSTAR_MARKER)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.lostzone.cards.length >= 10) {
                const opponent = game_1.StateUtils.getOpponent(state, player);
                const activePokemon = opponent.active.getPokemonCard();
                if (activePokemon) {
                    activePokemon.hp = 0;
                    player.marker.addMarker(this.VSTAR_MARKER, this);
                }
            }
        }
        return state;
    }
}
exports.GiratinaVSTAR = GiratinaVSTAR;
