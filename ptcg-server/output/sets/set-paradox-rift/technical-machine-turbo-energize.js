"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnicalMachineTurboEnergize = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class TechnicalMachineTurboEnergize extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'G';
        this.tags = [];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '179';
        this.name = 'Technical Machine: Turbo Energize';
        this.fullName = 'Technical Machine: Turbo Energize PAR';
        this.attacks = [{
                name: 'Turbo Energize',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for up to 2 Basic Energy cards and attach them to your Benched Pokémon in any way you like. Then, shuffle your deck.'
            }];
        this.text = 'The Pokémon this card is attached to can use the attack on this card. (You still need the necessary Energy to use this attack.) If this card is attached to 1 of your Pokémon, discard it at the end of your turn.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.tool) {
            const player = effect.player;
            const tool = effect.player.active.tool;
            if (tool.name === this.name) {
                player.active.moveCardTo(tool, player.discard);
                player.active.tool = undefined;
            }
            return state;
        }
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect && ((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tools.includes(this)) &&
            !effect.attacks.includes(this.attacks[0])) {
            effect.attacks.push(this.attacks[0]);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { max: 2, allowCancel: true }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                }
                return state;
            });
            return state;
        }
        return state;
    }
}
exports.TechnicalMachineTurboEnergize = TechnicalMachineTurboEnergize;
