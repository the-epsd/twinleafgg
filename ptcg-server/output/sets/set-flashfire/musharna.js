"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Musharna = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const card_list_1 = require("../../game/store/state/card-list");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Musharna extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Munna';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Forewarn',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may look at ' +
                    'the top 2 cards of your deck, choose 1 of them, and put it into ' +
                    'your hand. Put the other card back on top of your deck.'
            }];
        this.attacks = [{
                name: 'Fluffy Dream',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 40,
                text: 'This Pokemon is now Asleep.'
            }];
        this.set = 'FLF';
        this.name = 'Musharna';
        this.fullName = 'Musharna NXD';
        this.FOREWARN_MARKER = 'FOREWARN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.FOREWARN_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            specialConditionEffect.target = player.active;
            store.reduceEffect(state, specialConditionEffect);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.FOREWARN_MARKER, this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            player.marker.addMarker(this.FOREWARN_MARKER, this);
            const deckTop = new card_list_1.CardList();
            deckTop.cards = player.deck.cards.slice(0, 2);
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                player.deck.moveCardsTo(selected, player.hand);
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.FOREWARN_MARKER, this);
        }
        return state;
    }
}
exports.Musharna = Musharna;
