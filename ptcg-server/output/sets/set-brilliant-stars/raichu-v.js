"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaichuV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const discard_energy_prompt_1 = require("../../game/store/prompts/discard-energy-prompt");
class RaichuV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 200;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Fast Charge',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 0,
                text: 'If you go first, you can use this attack during your first turn. Search your deck for a L Energy card and attach it to this Pokémon. Then, shuffle your deck.'
            },
            {
                name: 'Dynamic Spark',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING],
                damage: 60,
                damageCalculation: 'x',
                text: 'You may discard any amount of L Energy from your Pokémon. This attack does 60 damage for each card you discarded in this way.'
            }
        ];
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.name = 'Raichu V';
        this.fullName = 'Raichu V BRS';
    }
    // Implement power
    reduceEffect(store, state, effect) {
        const player = state.players[state.activePlayer];
        if (state.turn == 1 && player.active.cards[0] == this) {
            player.canAttackFirstTurn = true;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList === undefined) {
                return state;
            }
            if (player.canAttackFirstTurn) {
                return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_CARDS, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Lightning Energy' }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                    transfers = transfers || [];
                    // cancelled by user
                    if (transfers.length === 0) {
                        return state;
                    }
                    for (const transfer of transfers) {
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        player.deck.moveCardTo(transfer.card, target);
                    }
                    state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                });
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.canAttackFirstTurn) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_ATTACK_ON_FIRST_TURN);
            }
            // return store.prompt(state, new ChoosePokemonPrompt(
            //   player.id,
            //   GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
            //   PlayerType.BOTTOM_PLAYER,
            //   [SlotType.ACTIVE, SlotType.BENCH],
            //   { min: 1, max: 6, allowCancel: true }
            // ), targets => {
            //   targets.forEach(target => {
            let totalLightningEnergy = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const lightningCount = cardList.cards.filter(card => card instanceof game_1.EnergyCard && card.name === 'Lightning Energy').length;
                totalLightningEnergy += lightningCount;
            });
            console.log('Total Lightning Energy: ' + totalLightningEnergy);
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
                console.log('Total Damage: ' + effect.damage);
                return state;
            });
        }
        return state;
    }
}
exports.RaichuV = RaichuV;
