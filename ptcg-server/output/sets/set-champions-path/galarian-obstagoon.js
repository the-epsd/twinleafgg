"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalarianObstagoon = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class GalarianObstagoon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 170;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Wicked Ruler',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, you may have your opponent discard cards from their hand until they have 4 cards in their hand.'
            }];
        this.attacks = [
            {
                name: 'Knuckle Impact',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 180,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }
        ];
        this.set = 'CPA';
        this.name = 'Galarian Obstagoon';
        this.fullName = 'Galarian Obstagoon CPA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.evolvesFrom = 'Galarian Linoone';
        this.WICKED_RULER_MARKER = 'WICKED_RULER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(game_1.PokemonCardList.ATTACK_USED_2_MARKER, this)) {
            effect.player.active.marker.removeMarker(game_1.PokemonCardList.ATTACK_USED_MARKER, this);
            effect.player.active.marker.removeMarker(game_1.PokemonCardList.ATTACK_USED_2_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(game_1.PokemonCardList.ATTACK_USED_MARKER, this)) {
            effect.player.active.marker.addMarker(game_1.PokemonCardList.ATTACK_USED_2_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Check marker
            if (effect.player.active.marker.hasMarker(game_1.PokemonCardList.ATTACK_USED_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.active.marker.addMarker(game_1.PokemonCardList.ATTACK_USED_MARKER, this);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.WICKED_RULER_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const handSize = opponent.hand.cards.length;
            const cardsToRemove = handSize - 4;
            if (handSize <= 4) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.WICKED_RULER_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(opponent, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { min: cardsToRemove, max: cardsToRemove, allowCancel: false }), selected => {
                opponent.hand.moveCardsTo(selected, opponent.discard);
                selected.forEach((card, index) => {
                    store.log(state, game_message_1.GameLog.LOG_PLAYER_DISCARDS_CARD, { name: opponent.name, card: card.name, effectName: this.powers[0].name });
                });
                store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected), () => { });
                player.marker.addMarker(this.WICKED_RULER_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                return state;
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.WICKED_RULER_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.WICKED_RULER_MARKER, this);
        }
        return state;
    }
}
exports.GalarianObstagoon = GalarianObstagoon;
