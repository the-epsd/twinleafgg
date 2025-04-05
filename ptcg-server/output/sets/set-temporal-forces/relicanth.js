"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relicanth = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Relicanth extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Memory Dive',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Each of your evolved Pokémon can use any attack from its previous Evolutions. (You still need the necessary Energy to use each attack.)'
            }];
        this.attacks = [
            {
                name: 'Razor Fin',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'TEF';
        this.setNumber = '84';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Relicanth';
        this.fullName = 'Relicanth TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                return state;
            }
            let isRelicanthInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isRelicanthInPlay = true;
                }
            });
            if (!isRelicanthInPlay) {
                return state;
            }
            // Enable showAllStageAbilities for evolved Pokémon
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.stage !== card_types_1.Stage.BASIC) {
                    player.showAllStageAbilities = true;
                }
            });
            return state;
        }
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                return state;
            }
            let isRelicanthInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isRelicanthInPlay = true;
                }
            });
            if (!isRelicanthInPlay) {
                return state;
            }
            // Add attacks from previous evolutions to evolved Pokémon
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.stage !== card_types_1.Stage.BASIC) {
                    // Get all previous evolution attacks
                    for (const evolutionCard of cardList.cards) {
                        if (evolutionCard.superType === card_types_1.SuperType.POKEMON && evolutionCard !== card) {
                            effect.attacks.push(...(evolutionCard.attacks || []));
                        }
                    }
                }
            });
        }
        return state;
    }
}
exports.Relicanth = Relicanth;
