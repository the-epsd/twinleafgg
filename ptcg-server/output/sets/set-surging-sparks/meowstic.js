"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meowstic = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Meowstic extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Espurr';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Beckoning Tail',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'You must discard a Chill Teaser Toy card from your hand in order to use this Ability. Once during your turn, you may switch in 1 of your opponent\'s Benched Pokemon to the Active Spot.'
            }];
        this.attacks = [
            {
                name: 'Psyshot',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: ''
            }
        ];
        this.set = 'SSP';
        this.setNumber = '85';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Meowstic';
        this.fullName = 'Meowstic SSP';
        this.BECKONING_TAIL_MARKER = 'BECKONING_TAIL_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.BECKONING_TAIL_MARKER, this);
        }
        // Beckoning Tail
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.hand.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            let chillToyInHand = false;
            player.hand.cards.forEach(c => {
                if (c.name === 'Chill Teaser Toy') {
                    chillToyInHand = true;
                }
            });
            if (!chillToyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.BECKONING_TAIL_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { name: 'Chill Teaser Toy', superType: card_types_1.SuperType.TRAINER }, { allowCancel: false, min: 1, max: 1 }), cards => {
                player.hand.moveCardsTo(cards, player.discard);
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                    const cardList = result[0];
                    opponent.switchPokemon(cardList);
                });
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.BECKONING_TAIL_MARKER, this);
        }
        return state;
    }
}
exports.Meowstic = Meowstic;
