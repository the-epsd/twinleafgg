"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tornadus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
class Tornadus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Energy Wheel',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Move an Energy from 1 of your Benched Pokemon to this Pokemon.'
            }, {
                name: 'Hurricane',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'Move a basic Energy from this Pokemon to 1 of your ' +
                    'Benched Pokemon.'
            },
        ];
        this.set = 'EPO';
        this.name = 'Tornadus';
        this.fullName = 'Tornadus EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '89';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const blockedFrom = [];
            const blockedTo = [];
            let hasEnergyOnBench = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList === player.active) {
                    blockedFrom.push(target);
                    return;
                }
                blockedTo.push(target);
                if (cardList.cards.some(c => c instanceof game_1.EnergyCard)) {
                    hasEnergyOnBench = true;
                }
            });
            if (hasEnergyOnBench === false) {
                return state;
            }
            return store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_message_1.GameMessage.MOVE_ENERGY_TO_ACTIVE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false, blockedFrom, blockedTo }), result => {
                const transfers = result || [];
                transfers.forEach(transfer => {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    source.moveCardTo(transfer.card, target);
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            const hasBasicEnergy = player.active.cards.some(c => {
                return c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC;
            });
            if (hasBench === false || hasBasicEnergy === false) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.active.moveCardTo(transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.Tornadus = Tornadus;
