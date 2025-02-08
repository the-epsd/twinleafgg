"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaichuV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const discard_energy_prompt_1 = require("../../game/store/prompts/discard-energy-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class RaichuV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.cardType = L;
        this.hp = 200;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Fast Charge',
                cost: [L],
                damage: 0,
                canUseOnFirstTurn: true,
                text: 'If you go first, you can use this attack during your first turn. Search your deck for a L Energy card and attach it to this Pokémon. Then, shuffle your deck.'
            },
            {
                name: 'Dynamic Spark',
                cost: [L, L],
                damage: 60,
                damageCalculation: 'x',
                text: 'You may discard any amount of L Energy from your Pokémon. This attack does 60 damage for each card you discarded in this way.'
            }
        ];
        this.regulationMark = 'F';
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.name = 'Raichu V';
        this.fullName = 'Raichu V BRS';
    }
    // Implement power
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList === undefined) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_CARDS, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Lightning Energy' }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    prefabs_1.SHUFFLE_DECK(store, state, player);
                    return state;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                }
                prefabs_1.SHUFFLE_DECK(store, state, player);
                return state;
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            let totalLightningEnergy = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const lightningCount = cardList.cards.filter(card => card instanceof game_1.EnergyCard && card.name === 'Lightning Energy').length;
                totalLightningEnergy += lightningCount;
            });
            return store.prompt(state, new discard_energy_prompt_1.DiscardEnergyPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], // Card source is target Pokemon
            { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Lightning Energy' }, { min: 1, max: totalLightningEnergy, allowCancel: false }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    let totalDiscarded = 0;
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = player.discard;
                    source.moveCardTo(transfer.card, target);
                    totalDiscarded = transfers.length;
                    effect.damage = totalDiscarded * 60;
                }
                return state;
            });
        }
        return state;
    }
}
exports.RaichuV = RaichuV;
