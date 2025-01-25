"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiningCelebi = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class ShiningCelebi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Time Recall',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Each of your evolved Pokémon can use any attack from its previous Evolutions. (You still need the necessary Energy to use each attack.)'
            }];
        this.attacks = [{ name: 'Leaf Step', cost: [G, C], damage: 30, text: '' }];
        this.set = 'SMP';
        this.setNumber = 'SM79';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Shining Celebi';
        this.fullName = 'Shining Celebi SMP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard === this || (pokemonCard === null || pokemonCard === void 0 ? void 0 : pokemonCard.stage) === card_types_1.Stage.BASIC) {
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
        return state;
    }
    buildAttackList(state, store, player) {
        const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        const energyMap = checkProvidedEnergyEffect.energyMap;
        const pokemonCards = [];
        const blocked = [];
        player.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
            var _a;
            if (cardList === player.active && player.active.getPokemonCard() !== undefined) {
                const pokemons = cardList.getPokemons();
                this.checkAttack(state, store, player, pokemons.slice(0)[0], energyMap, pokemonCards, blocked);
                if (((_a = player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.STAGE_2 && pokemons.slice(1)[0].stage !== card_types_1.Stage.STAGE_2) {
                    this.checkAttack(state, store, player, pokemons.slice(1)[0], energyMap, pokemonCards, blocked);
                }
            }
        });
        return { pokemonCards, blocked };
    }
    checkAttack(state, store, player, card, energyMap, pokemonCards, blocked) {
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
exports.ShiningCelebi = ShiningCelebi;
