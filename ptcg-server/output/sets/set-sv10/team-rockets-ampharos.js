"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsAmpharos = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsAmpharos extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Team Rocket\'s Flaaffy';
        this.tags = [game_1.CardTag.TEAM_ROCKET];
        this.cardType = L;
        this.hp = 140;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Darkest Impulse',
                powerType: game_1.PowerType.ABILITY,
                text: 'When your opponent plays a Pokémon from their hand to evolve 1 of their Pokémon during their turn, put 4 damage counters on that Pokémon. The effect of Darkest Impulse doesn\'t stack.'
            }];
        this.attacks = [{
                name: 'Head Bolt',
                cost: [L, C, C],
                damage: 140,
                text: ''
            }];
        this.set = 'SV10';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
        this.name = 'Team Rocket\'s Ampharos';
        this.fullName = 'Team Rocket\'s Ampharos SV10';
    }
    reduceEffect(store, state, effect) {
        // Darkest Impulse
        if (effect instanceof game_effects_1.EvolveEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            //const sourcePlayer = StateUtils.findOwner(state, effect.target);
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, opponent, this)) {
                return state;
            }
            if (effect.darkestImpulseSV) {
                return state;
            }
            // checking if this is on the opponent's side
            let isAmphyOnOppsSide = false;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    isAmphyOnOppsSide = true;
                }
            });
            if (!isAmphyOnOppsSide) {
                return state;
            }
            store.log(state, game_1.GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: this.powers[0].name });
            effect.target.damage += 40;
            effect.darkestImpulseSV = true;
        }
        return state;
    }
}
exports.TeamRocketsAmpharos = TeamRocketsAmpharos;
