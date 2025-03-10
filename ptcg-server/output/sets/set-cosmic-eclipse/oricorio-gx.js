"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OricorioGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class OricorioGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.hp = 170;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Dance of Tribute',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), if any of your Pokémon were Knocked Out during your opponent\’s last turn, you may draw 3 cards. You can\’t use more than 1 Dance of Tribute Ability each turn.'
            }];
        this.attacks = [{
                name: 'Razor Wing',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: ''
            },
            {
                name: 'Strafe GX',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
                    + ' (You can\'t use more than 1 GX attack in a game.) '
            }];
        this.set = 'CEC';
        this.setNumber = '95';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Oricorio GX';
        this.fullName = 'Oricorio GX CEC';
    }
    reduceEffect(store, state, effect) {
        //Dance of Tribute
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (!player.marker.hasMarker('OPPONENT_KNOCKOUT_MARKER')) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            //Once per turn only
            if (player.usedTributeDance == true) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.deck.moveTo(player.hand, 3);
            player.usedTributeDance = true;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
        }
        if (effect instanceof game_effects_1.KnockOutEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== state_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner === player) {
                prefabs_1.ADD_MARKER('OPPONENT_KNOCKOUT_MARKER', player, this);
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner === player) {
                prefabs_1.REMOVE_MARKER('OPPONENT_KNOCKOUT_MARKER', player, this);
            }
            player.usedTributeDance = false;
        }
        //Strafe GX
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            prefabs_1.BLOCK_IF_GX_ATTACK_USED(player);
            player.usedGX = true;
            prefabs_1.SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
        }
        return state;
    }
}
exports.OricorioGX = OricorioGX;
