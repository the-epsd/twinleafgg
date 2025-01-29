"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alakazam = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Alakazam extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kadabra';
        this.cardType = P;
        this.hp = 140;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Strange Hacking',
                cost: [P],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Confused. You may move any number of damage counters from your opponent\'s Pokémon to their other Pokémon in any way you like.'
            },
            {
                name: 'Psychic',
                cost: [P],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 50 more damage for each Energy attached to your opponent\'s Active Pokémon.'
            },
        ];
        this.set = 'TWM';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '82';
        this.name = 'Alakazam';
        this.fullName = 'Alakazam TWM';
    }
    reduceEffect(store, state, effect) {
        // Strange Hacking
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED]);
            store.reduceEffect(state, specialCondition);
            const maxAllowedDamage = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                const checkHpEffect = new check_effects_1.CheckHpEffect(opponent, cardList);
                store.reduceEffect(state, checkHpEffect);
                maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
            });
            return store.prompt(state, new game_1.MoveDamagePrompt(effect.player.id, game_1.GameMessage.MOVE_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], maxAllowedDamage, { allowCancel: true }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    if (source.damage >= 10) {
                        source.damage -= 10;
                        target.damage += 10;
                    }
                }
            });
        }
        // Psychic
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, opponentProvidedEnergy);
            const opponentEnergyCount = opponentProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage += opponentEnergyCount * 50;
        }
        return state;
    }
}
exports.Alakazam = Alakazam;
