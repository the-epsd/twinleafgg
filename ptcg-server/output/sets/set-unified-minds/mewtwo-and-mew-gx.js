"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MewtwoMewGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class MewtwoMewGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TAG_TEAM];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 270;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Perfection',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokemon can use the attacks of any Pokemon-GX or Pokemon-EX on your Bench ' +
                    'or in your discard pile. (You still need the necessary Energy to use each attack.)'
            }];
        this.attacks = [
            {
                name: 'Miraculous Duo-GX',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 200,
                text: 'If this Pokemon has at least 1 extra Energy attached to it (in addition to this attack\'s cost), ' +
                    'heal all damage from all of your Pokemon. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'UNM';
        this.name = 'Mewtwo & Mew-GX';
        this.fullName = 'Mewtwo & Mew-GX UNM';
        this.setNumber = '71';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Build cards and blocked for Choose Attack prompt
            const { pokemonCards, blocked } = this.buildAttackList(state, store, player);
            // No attacks to copy
            if (pokemonCards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, pokemonCards, { allowCancel: true, blocked }), attack => {
                if (attack !== null) {
                    const useAttackEffect = new game_effects_1.UseAttackEffect(player, attack);
                    store.reduceEffect(state, useAttackEffect);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Handle GX attack marker
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            player.usedGX = true;
            // Check for the extra energy cost.
            const extraEffectCost = [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (!meetsExtraEffectCost) {
                return state;
            } // If we don't have the extra energy, we just deal damage.
            // Otherwise, heal all of our Pokemon
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const healEffect = new game_effects_1.HealEffect(player, cardList, 999);
                store.reduceEffect(state, healEffect);
            });
        }
        return state;
    }
    buildAttackList(state, store, player) {
        const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        const energyMap = checkProvidedEnergyEffect.energyMap;
        const pokemonCards = [];
        const blocked = [];
        player.discard.cards.forEach((card) => {
            this.checkAttack(state, store, player, card, energyMap, pokemonCards, blocked);
        });
        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
            this.checkAttack(state, store, player, card, energyMap, pokemonCards, blocked);
        });
        return { pokemonCards, blocked };
    }
    checkAttack(state, store, player, card, energyMap, pokemonCards, blocked) {
        if (!(card instanceof pokemon_card_1.PokemonCard) || (card instanceof MewtwoMewGX) ||
            !(card.tags.includes(card_types_1.CardTag.POKEMON_EX) || card.tags.includes(card_types_1.CardTag.POKEMON_GX))) {
            return;
        }
        const attacks = card.attacks.filter(attack => {
            const checkAttackCost = new check_effects_1.CheckAttackCostEffect(player, attack);
            state = store.reduceEffect(state, checkAttackCost);
            return game_1.StateUtils.checkEnoughEnergy(energyMap, checkAttackCost.cost);
        });
        const index = pokemonCards.length;
        pokemonCards.push(card);
        card.attacks.forEach(attack => {
            if (!attacks.includes(attack)) {
                blocked.push({ index, attack: attack.name });
            }
        });
    }
}
exports.MewtwoMewGX = MewtwoMewGX;
