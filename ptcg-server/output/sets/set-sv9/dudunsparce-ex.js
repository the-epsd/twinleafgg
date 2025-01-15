"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dudunsparceex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Dudunsparceex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Dunsparce';
        this.cardType = C;
        this.hp = 270;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Adversity Tail',
                cost: [C],
                damage: 60,
                damageCalculation: 'x',
                text: 'This attack does 60 damage for each of your opponent\'s Pokemon ex in play.'
            },
            {
                name: 'Breaking Drill',
                cost: [C, C, C],
                damage: 150,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokemon.'
            }];
        this.regulationMark = 'H';
        this.set = 'SV9';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
        this.name = 'Dudunsparce ex';
        this.fullName = 'Dudunsparce ex SV9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let opponentexPokemon = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card.cardTag.includes(game_1.CardTag.POKEMON_ex)) {
                    opponentexPokemon++;
                }
            });
            effect.damage = opponentexPokemon * 60;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 150);
            store.reduceEffect(state, dealDamage);
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, dealDamage.damage);
            store.reduceEffect(state, applyWeakness);
            const damage = applyWeakness.damage;
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        return state;
    }
}
exports.Dudunsparceex = Dudunsparceex;
