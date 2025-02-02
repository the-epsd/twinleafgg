"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KartanaGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class KartanaGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.ULTRA_BEAST, card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 170;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Slice Off',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may discard a Special Energy from 1 of your opponent\'s Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Gale Blade',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: 'You may shuffle this Pokemon and all cards attached to it into your deck.'
            },
            {
                name: 'Blade-GX',
                cost: [card_types_1.CardType.METAL],
                damage: 0,
                gxAttack: true,
                text: 'Take a prize card. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'CIN';
        this.setNumber = '70';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Kartana-GX';
        this.fullName = 'Kartana-GX CIN';
    }
    reduceEffect(store, state, effect) {
        // Slice Off
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            let hasPokemonWithEnergy = false;
            const blocked = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.cards.some(c => c instanceof game_1.EnergyCard &&
                    c.energyType === card_types_1.EnergyType.SPECIAL)) {
                    hasPokemonWithEnergy = true;
                }
                else {
                    blocked.push(target);
                }
            });
            if (!hasPokemonWithEnergy) {
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
                    let targets = [];
                    store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), results => {
                        targets = results || [];
                        const target = targets[0];
                        let cards = [];
                        return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, target, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL }, { min: 1, max: 1, allowCancel: false }), selected => {
                            cards = selected;
                            target.moveCardsTo(cards, opponent.discard);
                        });
                    });
                }
            });
        }
        // Gale Blade
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    player.active.moveTo(player.deck);
                    player.active.clearEffects();
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                }
            });
        }
        // Blade-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.usedGX === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            return store.prompt(state, new game_1.ChoosePrizePrompt(player.id, game_1.GameMessage.CHOOSE_PRIZE_CARD, { count: 1, allowCancel: false }), prizes => {
                prizes[0].moveTo(player.hand);
            });
        }
        return state;
    }
}
exports.KartanaGX = KartanaGX;
