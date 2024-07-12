"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Azumarill = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Azumarill extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 120;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.evolvesFrom = 'Marill';
        this.attacks = [{
                name: 'Dive and Rescue',
                cost: [card_types_1.CardType.WATER],
                damage: 0,
                text: 'Put up to 3 in any combination of Pokémon and Supporter cards from your discard pile into your hand. '
            },
            {
                name: 'Surf',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: ''
            }];
        this.set = 'FST';
        this.setNumber = '59';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Azumarill';
        this.fullName = 'Azumarill FST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasSupporterOrPokemonInDiscard = player.discard.cards.some(c => {
                return (c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.SUPPORTER) || c instanceof pokemon_card_1.PokemonCard;
            });
            if (!hasSupporterOrPokemonInDiscard) {
                return state;
            }
            const blocked = [];
            player.discard.cards.forEach((c, index) => {
                const isPokemon = c instanceof pokemon_card_1.PokemonCard;
                const isSupporter = c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.SUPPORTER;
                if (!isPokemon && !isSupporter) {
                    blocked.push(index);
                }
            });
            if (hasSupporterOrPokemonInDiscard) {
                let cards = [];
                return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 1, max: 3, allowCancel: false, blocked }), selected => {
                    cards = selected || [];
                    player.discard.moveCardsTo(cards, player.hand);
                });
            }
        }
        return state;
    }
}
exports.Azumarill = Azumarill;
