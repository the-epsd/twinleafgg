"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gholdengoex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Gholdengoex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gimmighoul';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 260;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Bonus Coins',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may draw 1 card. If this ' +
                    'Pokémon is in the Active Spot, draw 2 cards instead. '
            }];
        this.attacks = [
            {
                name: 'Make It Rain',
                cost: [card_types_1.CardType.METAL],
                damage: 0,
                text: 'Discard any number of Basic Energy cards from your ' +
                    'hand. This attack does 50 damage for each card discarded ' +
                    'in this way.'
            }
        ];
        this.set = 'PAR';
        this.name = 'Gholdengo ex';
        this.fullName = 'Gholdengo ex PAR';
        this.MAKE_IT_RAIN_MARKER = 'MAKE_IT_RAIN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Prompt player to choose cards to discard 
            return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
                player.hand.moveCardsTo(cards, player.discard);
                // Calculate damage
                const damage = cards.length * 50;
                effect.damage = damage;
                return state;
            });
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.MAKE_IT_RAIN_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.MAKE_IT_RAIN_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.MAKE_IT_RAIN_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.cards[0] !== this) {
                // Draw a card
                player.deck.moveTo(player.hand, 1);
                player.marker.addMarker(this.MAKE_IT_RAIN_MARKER, this);
            }
            else {
                player.deck.moveTo(player.hand, 2);
                player.marker.addMarker(this.MAKE_IT_RAIN_MARKER, this);
            }
            if (effect instanceof game_phase_effects_1.EndTurnEffect) {
                effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, player => {
                    if (player instanceof Gholdengoex) {
                        player.marker.removeMarker(this.MAKE_IT_RAIN_MARKER);
                    }
                    return state;
                });
            }
            return state;
        }
        return state;
    }
}
exports.Gholdengoex = Gholdengoex;
