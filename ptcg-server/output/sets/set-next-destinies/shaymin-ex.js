"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShayminEX = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ShayminEX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.tags = [game_1.CardTag.POKEMON_EX];
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Synthesis',
                cost: [G],
                damage: 0,
                text: 'Search your deck for a [G] Energy card and attach it to 1 of your Pokémon. Shuffle your deck afterward.'
            },
            {
                name: 'Revenge Blast',
                cost: [G, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Does 30 more damage for each Prize card your opponent has taken.'
            },
        ];
        this.set = 'NXD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Shaymin EX';
        this.fullName = 'Shaymin EX NXD';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC, name: 'Grass Energy' }, { allowCancel: true, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return prefabs_1.SHUFFLE_DECK(store, state, player);
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                }
                return prefabs_1.SHUFFLE_DECK(store, state, player);
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.DEAL_MORE_DAMAGE_FOR_EACH_PRIZE_CARD_TAKEN(effect, state, 30);
        }
        return state;
    }
}
exports.ShayminEX = ShayminEX;
