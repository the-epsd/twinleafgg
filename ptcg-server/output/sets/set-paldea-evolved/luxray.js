"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Luxray = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Luxray extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Luxio';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Swelling Flash',
                powerType: game_1.PowerType.ABILITY,
                useFromHand: true,
                text: 'Once during your turn, if this Pokémon is in your hand and you have more Prize cards remaining than your opponent, you may put this Pokémon onto your Bench.'
            }];
        this.attacks = [{
                name: 'Wild Charge',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 180,
                text: 'This Pokémon also does 20 damage to itself.'
            }];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Luxray';
        this.fullName = 'Luxray PAL';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.GET_PLAYER_PRIZES(player).length <= prefabs_1.GET_PLAYER_PRIZES(opponent).length)
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            prefabs_1.PLAY_POKEMON_FROM_HAND_TO_BENCH(state, player, this);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this))
            prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 20);
        return state;
    }
}
exports.Luxray = Luxray;
