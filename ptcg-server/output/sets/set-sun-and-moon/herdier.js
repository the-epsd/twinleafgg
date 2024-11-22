"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Herdier = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Herdier extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = card_types_1.CardType.COLORLESS;
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Lillipup';
        this.hp = 90;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.powers = [{
                name: 'Treasure Hunt',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may put an Item card from your discard pile into your hand.',
            },
        ];
        this.attacks = [
            {
                name: 'Bite',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: '',
            },
        ];
        this.set = 'SUM'; // Replace with the appropriate set abbreviation
        this.name = 'Herdier';
        this.fullName = 'Herdier SUM'; // Replace with the appropriate set abbreviation
        this.setNumber = '104';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.EvolveEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const hasItem = player.discard.cards.some(c => {
                return c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.ITEM;
            });
            if (!hasItem) {
                return state;
            }
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { min: 1, max: 2, allowCancel: true }), selected => {
                cards = selected || [];
                if (cards.length > 0) {
                    player.discard.moveCardsTo(cards, player.hand);
                }
            });
        }
        return state;
    }
}
exports.Herdier = Herdier;
