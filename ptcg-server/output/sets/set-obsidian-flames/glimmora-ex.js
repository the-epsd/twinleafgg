"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Glimmoraex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Glimmoraex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Glimmet';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = F;
        this.hp = 270;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [
            {
                name: 'Dust Field',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is in the Active Spot, your opponent can\'t have more than 3 Benched Pokémon. If they have 4 or more Benched Pokémon, they discard Benched Pokémon until they have 3 Pokémon on the Bench. If more than one effect changes the number of Benched Pokémon allowed, use the smaller number.'
            }
        ];
        this.attacks = [{
                name: 'Poisonous Gem',
                cost: [F, F],
                damage: 140,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.'
            }];
        this.set = 'OBF';
        this.name = 'Glimmora ex';
        this.fullName = 'Glimmora ex OBF';
        this.setNumber = '123';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Dust Field
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            effect.benchSizes = state.players.map((player, index) => {
                // gotta check the ability
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: game_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return 5;
                }
                // checking if glimmora is the opponent's active
                let isGlimmoraInPlay = false;
                const opponent = game_1.StateUtils.getOpponent(state, player);
                opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                    const pokemon = cardList.getPokemonCard();
                    if (!!pokemon && cardList === opponent.active && pokemon.name === 'Glimmora ex' && pokemon.powers.map(p => p.name).includes(this.powers[0].name)) {
                        isGlimmoraInPlay = true;
                    }
                });
                // if glim is the opponent's active, reduce the bench size
                if (isGlimmoraInPlay) {
                    return 3;
                }
                // if glim isn't the opponent's active, skip everything
                else {
                    return 5;
                }
            });
        }
        // Poisonous Gem
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = effect.opponent;
            prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
        }
        return state;
    }
}
exports.Glimmoraex = Glimmoraex;
