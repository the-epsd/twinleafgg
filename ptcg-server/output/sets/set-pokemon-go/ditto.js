"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ditto = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
// function* useApexDragon(next: Function, store: StoreLike, state: State,
//   effect: PowerEffect): IterableIterator<State> {
//   const player = effect.player;
//   const opponent = StateUtils.getOpponent(state, player);
//   const discardPokemon = player.discard.cards.filter(card => card.superType === SuperType.POKEMON) as PokemonCard[];
//   const basicPokemon = discardPokemon.filter(card => card.stage === Stage.BASIC);
//   // const blocked: { index: number; attack: string }[] = [];
//   // player.deck.cards.forEach((card, index) => {
//   //   if (card instanceof PokemonCard && card.tags !== undefined) {
//   //     blocked.push({ index, attack: card.attacks[0].name });
//   //   }
//   // });
//   // if (basicPokemon.length === 0) {
//   //   throw new GameError(GameMessage.CANNOT_USE_POWER);
//   // }
//   let selected: any;
//   yield store.prompt(state, new ChooseAttackPrompt(
//     player.id,
//     GameMessage.CHOOSE_ATTACK_TO_COPY,
//     basicPokemon,
//     { allowCancel: false }
//   ), result => {
//     selected = result;
//     next();
//   });
//   const attack: Attack | null = selected;
//   // Get energy required for the attack
//   const requiredEnergy = attack?.cost;
//   // Check if Ditto (the active Pokemon) has the required energy
//   if (!player.active.cards.some(c => c instanceof PokemonCard && requiredEnergy?.includes(c.cardType))) {
//     return state;
//   }
//   if (!attack) {
//     return state;
//   }
//   store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
//     name: player.name,
//     attack: attack.name
//   });
//   // Perform attack
//   const attackEffect = new AttackEffect(player, opponent, attack);
//   store.reduceEffect(state, attackEffect);
//   if (store.hasPrompts()) {
//     yield store.waitPrompt(state, () => next());
//   }
//   if (attackEffect.damage > 0) {
//     const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
//     state = store.reduceEffect(state, dealDamage);
//   }
//   return state;
// }
class Ditto extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Sudden Transormation',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'This Pokémon can use the attacks of any Basic Pokémon in your discard pile, except for Pokémon with a Rule Box (Pokémon V, Pokémon-GX, etc. have Rule Boxes). (You still need the necessary Energy to use each attack.)'
            }];
        this.set = 'PGO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.name = 'Ditto';
        this.fullName = 'Ditto PGO';
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
        return state;
    }
    buildAttackList(state, store, player) {
        const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        const energyMap = checkProvidedEnergyEffect.energyMap;
        const pokemonCards = [];
        const blocked = [];
        player.discard.cards.forEach(card => {
            if (card instanceof pokemon_card_1.PokemonCard && card.stage === card_types_1.Stage.BASIC) {
                this.checkAttack(state, store, player, card, energyMap, pokemonCards, blocked);
            }
        });
        return { pokemonCards, blocked };
    }
    checkAttack(state, store, player, card, energyMap, pokemonCards, blocked) {
        {
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
exports.Ditto = Ditto;
