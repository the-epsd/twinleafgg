"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsFlaaffy = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsFlaaffy extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Team Rocket\'s Mareep';
        this.tags = [game_1.CardTag.TEAM_ROCKET];
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Thunder Shock',
                cost: [L, C],
                damage: 50,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            }
        ];
        this.set = 'SV10';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
        this.name = 'Team Rocket\'s Flaaffy';
        this.fullName = 'Team Rocket\'s Flaaffy SV10';
    }
    reduceEffect(store, state, effect) {
        // Thunder Shock
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.TeamRocketsFlaaffy = TeamRocketsFlaaffy;
