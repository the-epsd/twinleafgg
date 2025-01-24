"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eevee = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const game_effects_2 = require("../../game/store/effects/game-effects");
const game_2 = require("../../game");
const game_3 = require("../../game");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Eevee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Energy Evolution',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you attach a basic Energy card from your hand to this Pokémon during your turn, you may search your deck for a card that evolves from this Pokémon that is the same type as that Energy card and put it onto this Pokémon to evolve it. Then, shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Quick Draw',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Flip a coin. If heads, draw a card.'
            }];
        this.set = 'SUM';
        this.setNumber = '101';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Eevee';
        this.fullName = 'Eevee SUM';
    }
    reduceEffect(store, state, effect) {
        // Energy Evolution (which is a mess but hey it works)
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const powerEffect = new game_effects_2.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            let eeveeloutionType = card_types_1.CardType.COLORLESS;
            switch (effect.energyCard.name) {
                case 'Water Energy':
                    eeveeloutionType = card_types_1.CardType.WATER;
                    break; // Vaporeon + Glaceon
                case 'Fire Energy':
                    eeveeloutionType = card_types_1.CardType.FIRE;
                    break; // Flareon
                case 'Lightning Energy':
                    eeveeloutionType = card_types_1.CardType.LIGHTNING;
                    break; // Jolteon
                case 'Grass Energy':
                    eeveeloutionType = card_types_1.CardType.GRASS;
                    break; // Leafeon
                case 'Psychic Energy':
                    eeveeloutionType = card_types_1.CardType.PSYCHIC;
                    break; // Espeon + Sylveon (Post-SSH)
                case 'Darkness Energy':
                    eeveeloutionType = card_types_1.CardType.DARK;
                    break; // Umbreon
                case 'Fairy Energy':
                    eeveeloutionType = card_types_1.CardType.FAIRY;
                    break; // Sylveon (Pre-SSH)
                default:
                    eeveeloutionType = card_types_1.CardType.COLORLESS;
                    break; // just here to make sure nothing breaks
            }
            if (player.deck.cards.length === 0) {
                return state;
            }
            if (eeveeloutionType === card_types_1.CardType.COLORLESS) {
                return state;
            }
            player.forEachPokemon(game_2.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.getPokemonCard() === this) {
                    let cards = [];
                    return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.STAGE_1, evolvesFrom: 'Eevee', cardType: eeveeloutionType }, { min: 0, max: 1, allowCancel: false }), selected => {
                        cards = selected || [];
                        if (cards) {
                            player.deck.moveCardsTo(cards, cardList);
                            cardList.clearEffects();
                            cardList.pokemonPlayedTurn = state.turn;
                        }
                    });
                }
            });
        }
        // quick draw
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_3.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    player.deck.moveTo(player.hand, 1);
                }
            });
        }
        return state;
    }
}
exports.Eevee = Eevee;
