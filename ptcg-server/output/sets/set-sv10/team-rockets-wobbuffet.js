"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsWobbuffet = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsWobbuffet extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.TEAM_ROCKET];
        this.cardType = P;
        this.hp = 110;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Rocket Mirror',
                cost: [P, C],
                damage: 0,
                text: 'Move all damage counters from 1 of your Benched Team Rocket\'s Pokemon to your opponent\'s Active Pokemon.'
            },
            {
                name: 'Jet Headbutt',
                cost: [P, C, C],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'SV10';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Team Rocket\'s Wobbuffet';
        this.fullName = 'Team Rocket\'s Wobbuffet SV10';
    }
    reduceEffect(store, state, effect) {
        // Rocket Mirror
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            // checking for a damaged rockets pokemon on the bench
            const blockedTo = [];
            let isRocketDamaged = false;
            player.bench.forEach((cardList, index) => {
                var _a;
                if (cardList.cards.length > 0 && ((_a = cardList.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(game_1.CardTag.TEAM_ROCKET)) && cardList.damage > 0) {
                    isRocketDamaged = true;
                }
                else {
                    const target = {
                        player: game_1.PlayerType.BOTTOM_PLAYER,
                        slot: game_1.SlotType.BENCH,
                        index
                    };
                    blockedTo.push(target);
                }
            });
            if (!isRocketDamaged) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, blocked: blockedTo }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                let damageOnRocket = targets[0].damage;
                targets[0].damage = 0;
                effect.opponent.active.damage += damageOnRocket;
            });
        }
        return state;
    }
}
exports.TeamRocketsWobbuffet = TeamRocketsWobbuffet;
