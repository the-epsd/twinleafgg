"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Froslass = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const state_1 = require("../../game/store/state/state");
class Froslass extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Snorunt';
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.WATER;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.hp = 90;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Chilling Curtain',
                powerType: game_1.PowerType.ABILITY,
                text: 'During Pokémon Checkup, put 1 damage counter on each Pokémon in play that has any Abilities (excluding any Froslass).'
            }];
        this.attacks = [
            {
                name: 'Frost Smash',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'SV6';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Froslass';
        this.fullName = 'Froslass SV6';
        this.CHILLING_CURTAIN_MARKER = 'CHILLING_CURTAIN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && effect.player.marker.hasMarker(this.CHILLING_CURTAIN_MARKER, this)) {
            if (state.phase === state_1.GamePhase.BETWEEN_TURNS) {
                const player = effect.player;
                try {
                    const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                    store.reduceEffect(state, powerEffect);
                }
                catch (_a) {
                    return state;
                }
                const opponent = game_1.StateUtils.getOpponent(state, player);
                let numberOfFroslass = 0;
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    const pokemon = cardList.getPokemonCard();
                    if (!!pokemon && pokemon.name === 'Froslass' && pokemon.powers.map(p => p.name).includes(this.powers[0].name)) {
                        numberOfFroslass += 1;
                    }
                });
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if (card.powers.length > 0 && card.name !== 'Froslass') {
                        cardList.damage += (10 * numberOfFroslass);
                    }
                });
                opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if (card.name !== 'Froslass' && card.powers.length > 0) {
                        cardList.damage += (10 * numberOfFroslass);
                    }
                });
                player.marker.removeMarker(this.CHILLING_CURTAIN_MARKER, this);
                return state;
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            let numberOfFroslass = 0;
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const pokemon = cardList.getPokemonCard();
                if (!!pokemon && pokemon.name === 'Froslass' && pokemon.powers.map(p => p.name).includes(this.powers[0].name)) {
                    numberOfFroslass += 1;
                }
            });
            if (numberOfFroslass > 0 && !player.marker.hasMarker(this.CHILLING_CURTAIN_MARKER)) {
                player.marker.addMarker(this.CHILLING_CURTAIN_MARKER, this);
            }
            numberOfFroslass = 0;
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const pokemon = cardList.getPokemonCard();
                if (!!pokemon && pokemon.name === 'Froslass' && pokemon.powers.map(p => p.name).includes(this.powers[0].name)) {
                    numberOfFroslass += 1;
                }
            });
            if (numberOfFroslass > 0 && !opponent.marker.hasMarker(this.CHILLING_CURTAIN_MARKER)) {
                opponent.marker.addMarker(this.CHILLING_CURTAIN_MARKER, this);
            }
        }
        return state;
    }
}
exports.Froslass = Froslass;
