"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vanilluxe = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Vanilluxe extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Vanillish';
        this.cardType = W;
        this.hp = 150;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Frigid Room',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your opponent\'s Pokémon that have 40 HP or less remaining can\'t attack.'
            }];
        this.attacks = [{
                name: 'Icicle Missile',
                cost: [W, W],
                damage: 110,
                text: ''
            }];
        this.set = 'PAR';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.name = 'Vanilluxe';
        this.fullName = 'Vanilluxe PAR';
    }
    reduceEffect(store, state, effect) {
        // Frigid Room
        if (effect instanceof game_effects_1.AttackEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // checking if this is in play on the opponent's side
            let isVanilluxeInPlay = false;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    isVanilluxeInPlay = true;
                }
            });
            if (!isVanilluxeInPlay) {
                return state;
            }
            // checking for ability lock (way cleaner than before :) )
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, opponent, this)) {
                return state;
            }
            // checking for any hp boosters/removers
            const checkHpEffect = new check_effects_1.CheckHpEffect(effect.player, effect.source);
            store.reduceEffect(state, checkHpEffect);
            // actually doing the attack blocking
            if (checkHpEffect.hp - effect.source.damage <= 40) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        return state;
    }
}
exports.Vanilluxe = Vanilluxe;
