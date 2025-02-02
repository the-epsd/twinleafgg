"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buzzwole = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Buzzwole extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.ULTRA_BEAST];
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Beast Boost',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokemon\'s attacks do 20 more damage to your opponent\'s Active Pokemon for each Prize card you have taken (before applying Weakness and Resistance'
            }];
        this.attacks = [{
                name: 'Touchdown',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'Heal 30 damage from this Pokémon'
            }];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Buzzwole';
        this.fullName = 'Buzzwole CEC';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target === game_1.StateUtils.getOpponent(state, effect.player).active) {
            const player = effect.player;
            const prizesTaken = 6 - player.getPrizeLeft();
            console.log('Current Damage Boost: ' + (20 * prizesTaken));
            if (player.active.getPokemonCard() === this) {
                effect.damage += (20 * prizesTaken);
                console.log('Current Damage: ' + effect.damage);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const target = player.active;
            const healEffect = new game_effects_1.HealEffect(player, target, 30);
            state = store.reduceEffect(state, healEffect);
            return state;
        }
        return state;
    }
}
exports.Buzzwole = Buzzwole;
