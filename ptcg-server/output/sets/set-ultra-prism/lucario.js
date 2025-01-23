"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LucarioUPR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class LucarioUPR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Riolu';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Precognitive Aura',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if you have Garchomp in play, you may search your deck for a card and put it into your hand. Then, shuffle your deck.'
            }];
        this.attacks = [
            {
                name: 'Missile Jab',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: 'This attack\'s damage isn\'t affected by Resistance. '
            }
        ];
        this.set = 'UPR';
        this.setNumber = '67';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lucario';
        this.fullName = 'Lucario UPR';
        this.PRECOGNITIVE_MARKER = 'PRECOGNITIVE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.PRECOGNITIVE_MARKER, this);
        }
        // Precognitive Aura
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.PRECOGNITIVE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            // checking for a garchomp
            let isGarchompThere = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                var _a;
                if ((_a = cardList.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name.includes('Garchomp')) {
                    isGarchompThere = true;
                }
            });
            if (!isGarchompThere) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            let cards = [];
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                player.marker.addMarker(this.PRECOGNITIVE_MARKER, this);
                player.deck.moveCardsTo(cards, player.hand);
            });
        }
        // Missile Jab
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.ignoreResistance = true;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.PRECOGNITIVE_MARKER, this);
        }
        return state;
    }
}
exports.LucarioUPR = LucarioUPR;
