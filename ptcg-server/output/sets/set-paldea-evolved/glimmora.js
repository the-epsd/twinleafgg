"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Glimmora = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Glimmora extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Glimmet';
        this.cardType = F;
        this.hp = 130;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Shattering Crystal',
                powerType: game_1.PowerType.ABILITY,
                text: 'When this Pokémon is Knocked Out, flip a coin. If heads, your opponent can\'t take any Prize cards for it.',
            }];
        this.attacks = [
            {
                name: 'Poison Petals',
                cost: [F],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Poisoned. During Pokémon Checkup, put 6 damage counters on that Pokémon instead of 1.'
            },
        ];
        this.set = 'PAL';
        this.setNumber = '126';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'G';
        this.name = 'Glimmora';
        this.fullName = 'Glimmora PAL';
    }
    reduceEffect(store, state, effect) {
        // Shattering Crystal
        if (effect instanceof game_effects_1.KnockOutEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            // checking if this is the target for the damage
            if (effect.target.getPokemonCard() !== this) {
                return state;
            }
            // Flip a coin, and if heads, prevent damage.
            try {
                const coinFlip = new play_card_effects_1.CoinFlipEffect(player);
                store.reduceEffect(state, coinFlip);
            }
            catch (_a) {
                return state;
            }
            const coinFlipResult = prefabs_1.SIMULATE_COIN_FLIP(store, state, player);
            if (coinFlipResult) {
                effect.prizeCount = 0;
                store.log(state, game_1.GameLog.LOG_ABILITY_BLOCKS_DAMAGE, { name: opponent.name, pokemon: this.name });
            }
        }
        // Energy Feather
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = effect.opponent;
            prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this, 60);
        }
        return state;
    }
}
exports.Glimmora = Glimmora;
