"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Garganacl = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Garganacl extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Naclstack';
        this.cardType = F;
        this.hp = 180;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Blessed Salt',
                powerType: game_1.PowerType.ABILITY,
                text: 'During Pokémon Checkup, heal 20 damage from each of your Pokémon.'
            }];
        this.attacks = [{
                name: 'Knocking Hammer',
                cost: [F, F],
                damage: 130,
                text: 'Discard the top card of your opponent\'s deck.'
            }];
        this.BLESSED_SALT_MARKER = 'BLESSED_SALT_MARKER';
        this.set = 'PAL';
        this.name = 'Garganacl';
        this.fullName = 'Garganacl PAL';
        this.setNumber = '123';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Blessed Salt
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && effect.player.marker.hasMarker(this.BLESSED_SALT_MARKER, this)) {
            if (state.phase === state_1.GamePhase.BETWEEN_TURNS) {
                const player = effect.player;
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: game_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return state;
                }
                let numOfGargs = 0;
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    const pokemon = cardList.getPokemonCard();
                    if (!!pokemon && pokemon.name === 'Garganacl' && pokemon.powers.map(p => p.name).includes(this.powers[0].name)) {
                        numOfGargs += 1;
                    }
                });
                console.log('Number of Garganacls: ' + numOfGargs + ' --------------------------');
                let testVar = 0;
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    testVar++;
                    const healEffect = new game_effects_1.HealEffect(player, cardList, (20 * numOfGargs));
                    store.reduceEffect(state, healEffect);
                });
                console.log(testVar);
                player.marker.removeMarker(this.BLESSED_SALT_MARKER, this);
                return state;
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            let numOfGargs = 0;
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const pokemon = cardList.getPokemonCard();
                if (!!pokemon && pokemon.name === 'Garganacl' && pokemon.powers.map(p => p.name).includes(this.powers[0].name)) {
                    numOfGargs += 1;
                }
            });
            if (numOfGargs > 0 && !player.marker.hasMarker(this.BLESSED_SALT_MARKER)) {
                player.marker.addMarker(this.BLESSED_SALT_MARKER, this);
            }
            numOfGargs = 0;
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const pokemon = cardList.getPokemonCard();
                if (!!pokemon && pokemon.name === 'Garganacl' && pokemon.powers.map(p => p.name).includes(this.powers[0].name)) {
                    numOfGargs += 1;
                }
            });
            if (numOfGargs > 0 && !opponent.marker.hasMarker(this.BLESSED_SALT_MARKER)) {
                opponent.marker.addMarker(this.BLESSED_SALT_MARKER, this);
            }
        }
        // Knocking Hammer
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.deck.moveTo(opponent.discard, 1);
        }
        return state;
    }
}
exports.Garganacl = Garganacl;
