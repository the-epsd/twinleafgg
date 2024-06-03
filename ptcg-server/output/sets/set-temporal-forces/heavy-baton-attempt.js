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
        this.set = 'PAR';
        this.name = 'Heavy Baton';
        this.fullName = 'Heavy Baton PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '151';
        this.text = 'If the Pokémon this card is attached to has a Retreat Cost of exactly 4, is in the Active Spot, and is Knocked Out by damage from an attack from your opponent\'s Pokémon, move up to 3 Basic Energy cards from that Pokémon to your Benched Pokémon in any way you like.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof game_effects_1.KnockOutEffect && effect.player.active.tool == this) {
            const player = effect.player;
            const target = effect.target;
            const active = player.active;
            const cards = target.getPokemons();
            if (((_a = active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.retreat.length) == 4) {
                return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: true, min: 0, max: 3 }), transfers => {
                    transfers = transfers || [];
                    // cancelled by user
                    if (transfers.length === 0) {
                        return state;
                    }
                    for (const transfer of transfers) {
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        player.deck.moveCardTo(transfer.card, target);
                    }
                    //Prize Cards
                    if (cards.some(card => card.tags.includes(card_types_1.CardTag.POKEMON_EX) || card.tags.includes(card_types_1.CardTag.POKEMON_V) || card.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) || card.tags.includes(card_types_1.CardTag.POKEMON_ex))) {
                        effect.prizeCount += 1;
                    }
                    if (cards.some(card => card.tags.includes(card_types_1.CardTag.POKEMON_VMAX))) {
                        effect.prizeCount += 2;
                    }
                });
            }
        }
        return state;
    }
}
exports.HeavyBaton = HeavyBaton;
