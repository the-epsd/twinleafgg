"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreninjaZoroarkGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class GreninjaZoroarkGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TAG_TEAM];
        this.cardType = D;
        this.hp = 250;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Dark Pulse',
                cost: [D, C],
                damage: 30,
                damageCalculation: '+',
                text: 'This attack does 30 more damage times the amount of [D] Energy attached to all of your Pokémon.'
            },
            {
                name: 'Dark Union-GX',
                cost: [D, C],
                damage: 0,
                text: 'Put 2 in any combination of [D] Pokémon-GX and [D] Pokémon-EX from your discard pile onto your Bench. If this Pokémon has at least 1 extra Energy attached to it (in addition to this attack\'s cost), attach 2 Energy cards from your discard pile to each Pokémon that you put onto your Bench in this way. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
        this.name = 'Greninja & Zoroark-GX';
        this.fullName = 'Greninja & Zoroark-GX UNB';
    }
    reduceEffect(store, state, effect) {
        // Dark Pulse
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let darkEnergies = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const darkEnergy = cardList.cards.filter(card => card instanceof game_1.EnergyCard && card.name === 'Darkness Energy');
                darkEnergies += darkEnergy.length;
            });
            effect.damage += 30 * darkEnergies;
        }
        // Dark Union-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const slots = player.bench.filter(b => b.cards.length === 0);
            if (slots.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            if (player.usedGX) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            player.usedGX = true;
            const unionBlocked = [];
            player.discard.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard
                    && (!card.tags.includes(card_types_1.CardTag.POKEMON_GX) && !card.tags.includes(card_types_1.CardTag.POKEMON_EX))
                    && card.cardType !== D) {
                    unionBlocked.push(index);
                }
            });
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.discard, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 2, allowCancel: false, blocked: unionBlocked }), selected => {
                cards = selected || [];
                if (cards.length === 0) {
                    return state;
                }
                cards.forEach((card, index) => {
                    player.discard.moveCardTo(card, slots[index]);
                    slots[index].pokemonPlayedTurn = state.turn;
                });
            });
            // Check for the extra energy cost.
            const extraEffectCost = [D, C, C];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (!meetsExtraEffectCost) {
                return state;
            } // If we don't have the extra energy, we just deal damage.
            // energy attachments
            const blockedTo = [];
            player.bench.forEach((bench, index) => {
                if (bench.cards.length === 0) {
                    return;
                }
                const pokemonCard = bench.getPokemonCard();
                if (!!(pokemonCard === null || pokemonCard === void 0 ? void 0 : pokemonCard.cards.cards) && cards.includes(pokemonCard === null || pokemonCard === void 0 ? void 0 : pokemonCard.cards.cards[0])) {
                    return;
                }
                else {
                    const target = {
                        player: game_1.PlayerType.BOTTOM_PLAYER,
                        slot: game_1.SlotType.BENCH,
                        index
                    };
                    blockedTo.push(target);
                }
            });
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, differentTargets: true, min: 0, max: 2, blockedTo }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.GreninjaZoroarkGX = GreninjaZoroarkGX;
