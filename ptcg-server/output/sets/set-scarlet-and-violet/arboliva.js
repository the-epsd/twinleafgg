"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arboliva = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Arboliva extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Dolliv';
        this.powers = [{
                name: 'Enriching Oil',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may heal all damage from 1 of your Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Solar Beam',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 150,
                text: ''
            }
        ];
        this.regulationMark = 'G';
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
        this.name = 'Arboliva';
        this.fullName = 'Arboliva SVI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.EvolveEffect && effect.pokemonCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const blocked = [];
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                        if (cardList.damage === 0) {
                            blocked.push(target);
                        }
                    });
                    let targets = [];
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 0, max: 1, allowCancel: false, blocked }), results => {
                        targets = results || [];
                        if (targets.length === 0) {
                            return state;
                        }
                        targets.forEach(target => {
                            // Heal Pokemon
                            const healEffect = new game_effects_1.HealEffect(player, target, 999);
                            store.reduceEffect(state, healEffect);
                        });
                        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                            if (cardList.getPokemonCard() === this) {
                                cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                            }
                        });
                        return state;
                    });
                }
            });
        }
        return state;
    }
}
exports.Arboliva = Arboliva;
