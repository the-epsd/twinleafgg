"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sudowoodo = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sudowoodo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 100;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Roadblock',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your opponent can\'t have more than 4 Benched Pokémon. If they have 5 or more Benched Pokémon, they discard Benched Pokémon until they have 4 Pokémon on the Bench. If more than one effect changes the number of Benched Pokémon allowed, use the smaller number.'
            }];
        this.attacks = [{
                name: 'Rock Throw',
                cost: [F, C],
                damage: 40,
                text: ''
            }];
        this.set = 'GRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.name = 'Sudowoodo';
        this.fullName = 'Sudowoodo GRI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            effect.benchSizes = state.players.map((player, index) => {
                // Return original bench size if Ability is blocked
                if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                    return 5;
                }
                // Check for Sudowoodo on opponent's board
                let isSudowoodoInPlay = false;
                const opponent = game_1.StateUtils.getOpponent(state, player);
                opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                    const pokemon = cardList.getPokemonCard();
                    if (!!pokemon && pokemon.name === 'Sudowoodo' && pokemon.powers.map(p => p.name).includes(this.powers[0].name)) {
                        isSudowoodoInPlay = true;
                    }
                });
                // Modify bench size
                if (isSudowoodoInPlay) {
                    return 4;
                }
                // Return original bench size
                return 5;
            });
        }
        return state;
    }
}
exports.Sudowoodo = Sudowoodo;
