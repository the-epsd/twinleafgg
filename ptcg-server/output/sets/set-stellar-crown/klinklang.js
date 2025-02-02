"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Klinklang = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Klinklang extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Klang';
        this.cardType = M;
        this.hp = 140;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Emergency Rotation',
                powerType: game_1.PowerType.ABILITY,
                useFromHand: true,
                text: 'Once during your turn, if this Pokémon is in your hand and your opponent has any Stage 2 Pokémon in play, ' +
                    'you may put this Pokémon onto your Bench.'
            }];
        this.attacks = [
            {
                name: 'Hyper Ray',
                cost: [C, C],
                damage: 130,
                text: 'Discard all Energy from this Pokémon.'
            }
        ];
        this.set = 'SCR';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '101';
        this.name = 'Klinklang';
        this.fullName = 'Klinklang SCR';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const opponentStage2InPlay = game_1.StateUtils.getOpponent(state, player)
                .getPokemonInPlay().filter(c => { var _a; return ((_a = c.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.STAGE_2; });
            if (opponentStage2InPlay.length === 0)
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            prefabs_1.PLAY_POKEMON_FROM_HAND_TO_BENCH(state, player, this);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this))
            prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
        return state;
    }
}
exports.Klinklang = Klinklang;
