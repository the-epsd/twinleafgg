"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsPorygonZ = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class TeamRocketsPorygonZ extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.evolvesFrom = 'Team Rocket\'s Porygon2';
        this.cardType = C;
        this.hp = 140;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Reconstitute',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'You must discard 2 cards from your hand in order to use this Ability. Once during your turn, you may draw a card.'
            }];
        this.attacks = [
            {
                name: 'Control R',
                cost: [C, C],
                damage: 20,
                damageCalculation: '*',
                text: 'This attack does 20 damage for each Supporter in your discard pile with "Team Rocket" in its name.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'SV10';
        this.setNumber = '83';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Porygon-Z';
        this.fullName = 'Team Rocket\'s Porygon-Z SV10';
        this.RECONSTITUTE_MARKER = 'RECONSTITUTE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Reset ability usage at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.RECONSTITUTE_MARKER, this)) {
            effect.player.marker.removeMarker(this.RECONSTITUTE_MARKER, this);
        }
        // Reconstitute ability
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            // Check if ability was already used this turn
            if (player.marker.hasMarker(this.RECONSTITUTE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            // Need at least 2 cards to discard
            if (player.hand.cards.length < 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Need at least 1 card in deck to draw
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Choose 2 cards to discard
            state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: 2, max: 2 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                // Mark ability as used
                player.marker.addMarker(this.RECONSTITUTE_MARKER, this);
                // Add visual effect to show ability was used
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                // Discard the selected cards
                player.hand.moveCardsTo(cards, player.discard);
                // Draw a card
                player.deck.moveTo(player.hand, 1);
            });
            return state;
        }
        // Control R attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Count Team Rocket Supporters in discard pile
            const teamRocketSupporters = player.discard.cards.filter(card => card instanceof trainer_card_1.TrainerCard &&
                card.name.includes('Team Rocket') &&
                card.trainerType === card_types_1.TrainerType.SUPPORTER).length;
            // Set damage based on count
            effect.damage = 20 * teamRocketSupporters;
            return state;
        }
        return state;
    }
}
exports.TeamRocketsPorygonZ = TeamRocketsPorygonZ;
