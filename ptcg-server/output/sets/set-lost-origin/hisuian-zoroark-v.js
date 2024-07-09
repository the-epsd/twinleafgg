"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianZoroarkV = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class HisuianZoroarkV extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 220;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Void Return',
                cost: [],
                damage: 30,
                text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
            },
            {
                name: 'Shadow Cyclone',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 130,
                text: 'Move an Energy from this Pokémon to 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '146';
        this.name = 'Hisuian Zoroark V';
        this.fullName = 'Hisuian Zoroark V LOR';
        this.voidReturn = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            this.voidReturn = true;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.voidReturn == true) {
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_SWITCH_POKEMON), wantToUse => {
                if (wantToUse) {
                    return state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), selected => {
                        if (!selected || selected.length === 0) {
                            return state;
                        }
                        const target = selected[0];
                        player.switchPokemon(target);
                        this.voidReturn = false;
                    });
                }
            });
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
                const player = effect.player;
                const hasBench = player.bench.some(b => b.cards.length > 0);
                if (hasBench === false) {
                    return state;
                }
                return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                    transfers = transfers || [];
                    for (const transfer of transfers) {
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        player.active.moveCardTo(transfer.card, target);
                    }
                });
            }
        }
        return state;
    }
}
exports.HisuianZoroarkV = HisuianZoroarkV;
