"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eeveeex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Eeveeex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 200;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Rainbow DNA',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'You can play Pokemon ex that evolve from Eevee onto this Pokemon to evolve it. (You can\'t evolve this Pokemon during your first turn or during the turn you play it.) [Click this ability to use it'
            }];
        this.attacks = [
            {
                name: 'Quartz Shine',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING],
                damage: 200,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'PRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
        this.name = 'Eevee ex';
        this.fullName = 'Eevee ex SV8a';
    }
    reduceEffect(store, state, effect) {
        // Rainbow DNA
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.hand.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const blocked = player.hand.cards
                .filter(c => !c.tags.includes(card_types_1.CardTag.POKEMON_ex))
                .map(c => player.deck.cards.indexOf(c));
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.getPokemonCard() === this && cardList.pokemonPlayedTurn === state.turn) {
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                }
                if (cardList.getPokemonCard() === this) {
                    return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_POKEMON_TO_EVOLVE, player.hand, { superType: card_types_1.SuperType.POKEMON, evolvesFrom: 'Eevee' }, { allowCancel: false, min: 0, max: 1, blocked }), cards => {
                        if (cards.length > 0) {
                            cards = cards || [];
                            player.hand.moveCardsTo(cards, cardList);
                            cardList.clearEffects();
                            cardList.pokemonPlayedTurn = state.turn;
                        }
                    });
                }
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            // Target is this Pokemon
            if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Eeveeex = Eeveeex;
