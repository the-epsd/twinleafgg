"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mew = void 0;
const game_1 = require("../../game");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Mew extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Psywave',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 10,
                text: 'Does 10 damage times the number of Energy cards attached to the Defending Pokémon.'
            },
            {
                name: 'Devolution Beam',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Choose an evolved Pokémon (your own or your opponent\'s). Return the highest Stage Evolution card on that Pokémon to its player\'s hand. That Pokémon is no longer Asleep, Confused, Paralyzed, or Poisoned, or anything else that might be the result of an attack (just as if you had evolved it).'
            }
        ];
        this.set = 'PR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
        this.name = 'Mew';
        this.fullName = 'Mew PR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const energyCount = checkProvidedEnergyEffect.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage = energyCount * 10;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const options = [
                {
                    message: game_1.GameMessage.DISCARD_AND_DRAW,
                    action: () => {
                        //player
                        const blocked = [];
                        opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (list, card, target) => {
                            if (card.stage == card_types_1.Stage.BASIC) {
                                blocked.push(target);
                            }
                        });
                        return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { blocked: blocked, allowCancel: false }), result => {
                            const cardList = result.length > 0 ? result[0] : null;
                            if (cardList !== null) {
                                const pokemons = cardList.getPokemons();
                                const latestEvolution = pokemons.slice(-1)[0];
                                cardList.moveCardsTo([latestEvolution], opponent.hand);
                                cardList.clearEffects();
                            }
                        });
                    }
                },
                {
                    message: game_1.GameMessage.SWITCH_POKEMON,
                    action: () => {
                        //player
                        const blocked2 = [];
                        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                            if (card.stage == card_types_1.Stage.BASIC) {
                                blocked2.push(target);
                            }
                        });
                        return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { blocked: blocked2, allowCancel: false }), result => {
                            const cardList = result.length > 0 ? result[0] : null;
                            if (cardList !== null) {
                                const pokemons = cardList.getPokemons();
                                const latestEvolution = pokemons.slice(-1)[0];
                                cardList.moveCardsTo([latestEvolution], player.hand);
                                cardList.clearEffects();
                            }
                        });
                    }
                }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        return state;
    }
}
exports.Mew = Mew;
