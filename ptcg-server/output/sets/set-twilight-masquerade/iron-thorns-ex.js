"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronThornsex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class IronThornsex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.FUTURE];
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 230;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Initialize',
                powerType: game_1.PowerType.ABILITY,
                text: 'While this Pokémon is in the Active Spot, Pokémon with a Rule Box in play (except any Future Pokémon) don\'t have any Abilities.'
            }];
        this.attacks = [
            {
                name: 'Bolt Cyclone',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 140,
                text: 'Move 1 Energy from this Pokémon to 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'SV5a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Iron Thorns ex';
        this.fullName = 'Iron Thorns ex SV5a';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect
            && effect.power.powerType === game_1.PowerType.ABILITY
            && effect.power.name !== 'Initialize') {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isIronThornsexInPlay = false;
            if (player.active.cards[0] == this) {
                isIronThornsexInPlay = true;
            }
            if (opponent.active.cards[0] == this) {
                isIronThornsexInPlay = true;
            }
            if (!isIronThornsexInPlay) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            const pokemonCard = effect.card;
            if (pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_ex && card_types_1.CardTag.FUTURE)) {
                return state;
            }
            if (pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_V) ||
                pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_VMAX) ||
                pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) ||
                pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_ex) ||
                pokemonCard.tags.includes(card_types_1.CardTag.RADIANT)) {
                // pokemonCard.powers.length = 0;
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
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
        return state;
    }
}
exports.IronThornsex = IronThornsex;
