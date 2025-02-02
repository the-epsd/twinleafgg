"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeavyBaton = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class HeavyBaton extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'TEF';
        this.name = 'Heavy Baton';
        this.fullName = 'Heavy Baton PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '151';
        this.text = 'If the Pokémon this card is attached to has a Retreat Cost of exactly 4, is in the Active Spot, and is Knocked Out by damage from an attack from your opponent\'s Pokémon, move up to 3 Basic Energy cards from that Pokémon to your Benched Pokémon in any way you like.';
        this.HEAVY_BATON_MARKER = 'HEAVY_BATON_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const target = effect.target;
            const cards = target.getPokemons();
            const removedCards = [];
            const pokemonIndices = effect.target.cards.map((card, index) => index);
            const retreatCost = (_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.retreat.length;
            if (retreatCost !== undefined && retreatCost == 4) {
                for (let i = pokemonIndices.length - 1; i >= 0; i--) {
                    const removedCard = target.cards.splice(pokemonIndices[i], 1)[0];
                    removedCards.push(removedCard);
                    target.damage = 0;
                }
                if (cards.some(card => card.tags.includes(card_types_1.CardTag.POKEMON_EX) || card.tags.includes(card_types_1.CardTag.POKEMON_V) || card.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) || card.tags.includes(card_types_1.CardTag.POKEMON_ex))) {
                    effect.prizeCount += 1;
                }
                if (cards.some(card => card.tags.includes(card_types_1.CardTag.POKEMON_VMAX))) {
                    effect.prizeCount += 2;
                }
                const energyToAttach = new game_1.CardList();
                const toolCard = new game_1.CardList();
                toolCard.cards = removedCards.filter(c => c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.TOOL);
                const lostZoned = new game_1.CardList();
                lostZoned.cards = cards;
                const specialEnergy = new game_1.CardList();
                specialEnergy.cards = removedCards.filter(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.SPECIAL);
                const basicEnergy = new game_1.CardList();
                basicEnergy.cards = removedCards.filter(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC);
                lostZoned.moveTo(player.discard);
                toolCard.moveTo(player.discard);
                specialEnergy.moveTo(player.discard);
                basicEnergy.moveTo(energyToAttach);
                return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, energyToAttach, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 3 }), transfers => {
                    transfers = transfers || [];
                    // cancelled by user
                    if (transfers.length === 0) {
                        return;
                    }
                    for (const transfer of transfers) {
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        energyToAttach.moveCardTo(transfer.card, target);
                    }
                });
            }
            return state;
        }
        return state;
    }
}
exports.HeavyBaton = HeavyBaton;
