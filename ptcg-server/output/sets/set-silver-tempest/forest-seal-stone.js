"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForestSealStone = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const mew_ex_1 = require("../set-legendary-treasures/mew-ex");
const game_effects_1 = require("../../game/store/effects/game-effects");
class ForestSealStone extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.powers = [{
                name: 'Versatile',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokemon can use the attacks of any Pokemon in play ' +
                    '(both yours and your opponent\'s). (You still need the necessary ' +
                    'Energy to use each attack.)'
            }];
        this.attacks = [
            {
                name: 'Replace',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Move as many Energy attached to your Pokemon to your other ' +
                    'Pokemon in any way you like.'
            }
        ];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '156';
        this.regulationMark = 'F';
        this.name = 'Forest Seal Stone';
        this.fullName = 'Forest Seal Stone SIT';
        this.VSTAR_MARKER = 'VSTAR_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard instanceof ForestSealStone) {
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
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Rest of method
        }
        return state;
    }
    buildAttackList(state, store, player) {
        const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        const energyMap = checkProvidedEnergyEffect.energyMap;
        const pokemonCards = [];
        const blocked = [];
        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
            this.checkAttack(state, store, player, card, energyMap, pokemonCards, blocked);
        });
        return { pokemonCards, blocked };
    }
    checkAttack(state, store, player, card, energyMap, pokemonCards, blocked) {
        {
            // Only include Pokemon V cards
            if (!card.tags.includes(card_types_1.CardTag.POKEMON_V)) {
                return;
            }
            // No need to include Mew Ex to the list
            if (card instanceof mew_ex_1.MewEx) {
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
}
exports.ForestSealStone = ForestSealStone;
