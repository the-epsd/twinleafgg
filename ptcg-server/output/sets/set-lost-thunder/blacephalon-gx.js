"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlacephalonGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
class BlacephalonGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX, card_types_1.CardTag.ULTRA_BEAST];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Bursting Burn',
                cost: [card_types_1.CardType.FIRE],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Burned and Confused.'
            },
            {
                name: 'Mind Blown',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 50,
                text: 'Put any amount of [R] Energy attached to your Pokémon in the Lost Zone. This attack does 50 damage for each card put in the Lost Zone in this way.'
            },
            {
                name: 'Burst-GX',
                cost: [card_types_1.CardType.FIRE],
                damage: 0,
                text: 'Discard 1 of your Prize cards. If it\'s an Energy card, attach it to 1 of your Pokémon. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'LOT';
        this.name = 'Blacephalon-GX';
        this.fullName = 'Blacephalon-GX LOT';
        this.regulationMark = 'LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '52';
    }
    reduceEffect(store, state, effect) {
        // Bursting Burn
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED, card_types_1.SpecialCondition.BURNED]);
            return store.reduceEffect(state, specialCondition);
        }
        // Mind Blown
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let totalFireEnergy = 0;
            player.forEachPokemon(game_2.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const fireCount = cardList.cards.filter(card => card instanceof game_2.EnergyCard && card.name === 'Fire Energy').length;
                totalFireEnergy += fireCount;
            });
            return store.prompt(state, new game_1.DiscardEnergyPrompt(player.id, game_2.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_2.PlayerType.BOTTOM_PLAYER, [game_2.SlotType.ACTIVE, game_2.SlotType.BENCH], // Card source is target Pokemon
            { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { min: 1, max: totalFireEnergy, allowCancel: false }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    let totalDiscarded = 0;
                    const source = state_utils_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = player.discard;
                    source.moveCardTo(transfer.card, target);
                    totalDiscarded = transfers.length;
                    effect.damage = totalDiscarded * 50;
                }
                return state;
            });
        }
        // Burst-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const player = effect.player;
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_2.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            return store.prompt(state, new game_1.ChoosePrizePrompt(player.id, game_2.GameMessage.CHOOSE_PRIZE_CARD, { count: 1, allowCancel: false }), prizes => {
                const holdingZone = new game_1.CardList;
                prizes[0].moveTo(holdingZone);
                const discardedEnergy = holdingZone.cards.filter(card => {
                    return card instanceof game_2.EnergyCard;
                });
                if (discardedEnergy.length == 0) {
                    holdingZone.moveTo(player.discard);
                }
                if (discardedEnergy.length > 0) {
                    store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_2.GameMessage.ATTACH_ENERGY_TO_BENCH, holdingZone, game_2.PlayerType.BOTTOM_PLAYER, [game_2.SlotType.ACTIVE, game_2.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                        transfers = transfers || [];
                        for (const transfer of transfers) {
                            const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                            holdingZone.moveCardTo(transfer.card, target);
                        }
                    });
                }
            });
        }
        return state;
    }
}
exports.BlacephalonGX = BlacephalonGX;
