"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empoleon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Empoleon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Prinplup';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Diving Draw',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may discard ' +
                    'a card from your hand. If you do, draw 2 cards.'
            }];
        this.attacks = [
            {
                name: 'Attack Command',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: 'Does 10 damage times the number of Pokemon in play (both yours ' +
                    'and your opponent\'s).'
            }
        ];
        this.set = 'DEX';
        this.name = 'Empoleon';
        this.fullName = 'Empoleon DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '29';
        this.DIVING_DRAW_MAREKER = 'DIVING_DRAW_MAREKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.DIVING_DRAW_MAREKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.hand.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.DIVING_DRAW_MAREKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: true, min: 1, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                player.marker.addMarker(this.DIVING_DRAW_MAREKER, this);
                player.hand.moveCardsTo(cards, player.discard);
                player.deck.moveTo(player.hand, 2);
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let pokemonInPlay = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, () => { pokemonInPlay += 1; });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, () => { pokemonInPlay += 1; });
            effect.damage = 10 * pokemonInPlay;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.DIVING_DRAW_MAREKER, this)) {
            effect.player.marker.removeMarker(this.DIVING_DRAW_MAREKER, this);
        }
        return state;
    }
}
exports.Empoleon = Empoleon;
