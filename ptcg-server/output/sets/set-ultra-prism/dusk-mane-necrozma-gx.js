"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuskManeNecrozmaGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_3 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
// UPR Dusk Mane Necrozma-GX 90 (https://limitlesstcg.com/cards/UPR/90)
class DuskManeNecrozmaGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX, card_types_1.CardTag.ULTRA_BEAST];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Claw Slash',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            },
            {
                name: 'Meteor Tempest',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 220,
                text: 'Discard 3 Energy from this Pokémon.'
            },
            {
                name: 'Sun\'s Eclipse-GX',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.METAL],
                damage: 250,
                text: 'You can use this attack only if you have more Prize cards remaining than your opponent. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'UPR';
        this.setNumber = '90';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dusk Mane Necrozma-GX';
        this.fullName = 'Dusk Mane Necrozma-GX UPR';
    }
    reduceEffect(store, state, effect) {
        // Meteor Tempest
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_3.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
        }
        // Sun's Eclipse-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
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
        }
        return state;
    }
}
exports.DuskManeNecrozmaGX = DuskManeNecrozmaGX;
