"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EternatusV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class EternatusV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.cardType = D;
        this.hp = 220;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Power Accelerator',
                cost: [C],
                damage: 30,
                text: 'You may attach a [D] Energy card from your hand to 1 of your Benched Pokémon.'
            },
            {
                name: 'Dynamax Cannon',
                cost: [D, C, C, C],
                damage: 120,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is a Pokémon VMAX, this attack does 120 more damage.'
            }];
        this.set = 'DAA';
        this.name = 'Eternatus V';
        this.fullName = 'Eternatus V DAA';
        this.setNumber = '116';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Power Accelerator
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Dark Energy' }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.hand.moveCardTo(transfer.card, target);
                }
            });
        }
        // Dynamax Cannon
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((_a = opponent.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                effect.damage += 120;
            }
        }
        return state;
    }
}
exports.EternatusV = EternatusV;
