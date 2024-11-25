"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlolanMuk = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class AlolanMuk extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Alolan Grimer';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Adventurous Appetite',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may look at the top 6 cards of your opponent\'s deck and discard any number of Item cards you find there. Your opponent shuffles the other cards back into their deck.'
            }];
        this.attacks = [
            {
                name: 'Gunk Shot',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.'
            }
        ];
        this.set = 'TEU';
        this.name = 'Alolan Muk';
        this.fullName = 'Alolan Muk TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = game_1.StateUtils.getOpponent(state, player);
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
            const deckTop = new game_1.CardList();
            opponent.deck.moveTo(deckTop, 6);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, deckTop, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { min: 0, max: 6, allowCancel: false }), selected => {
                deckTop.moveCardsTo(selected, opponent.discard);
                deckTop.moveTo(opponent.deck);
                selected.forEach((card, index) => {
                    store.log(state, game_message_1.GameLog.LOG_PLAYER_DISCARDS_CARD, { name: player.name, card: card.name, effectName: this.powers[0].name });
                });
                store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected), () => { });
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const poisonEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
            store.reduceEffect(state, poisonEffect);
            return state;
        }
        return state;
    }
}
exports.AlolanMuk = AlolanMuk;
