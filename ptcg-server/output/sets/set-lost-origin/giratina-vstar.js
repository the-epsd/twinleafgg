"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiratinaVSTAR = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const discard_energy_prompt_1 = require("../../game/store/prompts/discard-energy-prompt");
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
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.lostzone.cards.length <= 9) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.usedVSTAR === true) {
                throw new game_1.GameError(game_message_1.GameMessage.LABEL_VSTAR_USED);
            }
            if (player.lostzone.cards.length >= 10) {
                const activePokemon = opponent.active.getPokemonCard();
                if (activePokemon) {
                    const dealDamage = new attack_effects_1.KnockOutOpponentEffect(effect, 999);
                    dealDamage.target = opponent.active;
                    store.reduceEffect(state, dealDamage);
                }
                player.usedVSTAR = true;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, new discard_energy_prompt_1.DiscardEnergyPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], // Card source is target Pokemon
            { superType: card_types_1.SuperType.ENERGY }, { min: 2, max: 2, allowCancel: false }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = player.lostzone;
                    source.moveCardTo(transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.GiratinaVSTAR = GiratinaVSTAR;
