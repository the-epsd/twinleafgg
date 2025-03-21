"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsPorygon2 = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
class TeamRocketsPorygon2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.evolvesFrom = 'Team Rocket\'s Porygon';
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Control R',
                cost: [C, C, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each Supporter in your discard pile with "Team Rocket" in its name.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'SV10';
        this.setNumber = '82';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Porygon2';
        this.fullName = 'Team Rocket\'s Porygon2 SV10';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Count Team Rocket Supporters in discard pile
            const teamRocketSupporters = player.discard.cards.filter(card => card instanceof trainer_card_1.TrainerCard &&
                card.name.includes('Team Rocket') &&
                card.trainerType === card_types_1.TrainerType.SUPPORTER).length;
            // Set damage based on count
            effect.damage = 20 * teamRocketSupporters;
            return state;
        }
        return state;
    }
}
exports.TeamRocketsPorygon2 = TeamRocketsPorygon2;
