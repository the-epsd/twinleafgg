"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VictiniEX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class VictiniEX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.cardType = R;
        this.hp = 110;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Turbo Energize',
                cost: [R],
                damage: 0,
                text: 'Search your deck for 2 basic Energy cards and attach them to your Benched Pokémon in any way you like. Shuffle your deck afterward.'
            },
            {
                name: 'Intensifying Burn',
                cost: [R, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'If the Defending Pokémon is a Pokémon-EX, this attack does 50 more damage.'
            },
        ];
        this.set = 'PLS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
        this.name = 'Victini EX';
        this.fullName = 'Victini EX PLS';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Turbo Energize
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const openSlots = player.bench.filter(b => b.cards.length === 0);
            if (!openSlots) {
                return state;
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 2 }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                }
            });
        }
        // Intensifying Butn
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            if ((_a = effect.opponent.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_EX)) {
                effect.damage += 50;
            }
        }
        return state;
    }
}
exports.VictiniEX = VictiniEX;
