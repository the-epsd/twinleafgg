"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZacianVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class ZacianVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.VSTAR;
        this.evolvesFrom = 'Zacian V';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 270;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Break Edge',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                // cost: [],
                damage: 200,
                text: 'This attack\'s damage isn\'t affected by Weakness or Resistance, or by any effects on your opponent\'s Active Pokémon.'
            },
            {
                name: 'Sword Star',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 310,
                text: 'This Pokémon also does 30 damage to itself. (You can\'t use more than 1 VSTAR Power in a game.)'
            },
        ];
        this.set = 'CRZ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Zacian VSTAR';
        this.fullName = 'Zacian VSTAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const damage = 200; // Fixed damage without weakness/resistance
            effect.ignoreResistance = true;
            effect.ignoreWeakness = true;
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const damage = 30;
            if (player.usedVSTAR === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_VSTAR_USED);
            }
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, damage);
            dealDamage.target = player.active;
            player.usedVSTAR = true;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.ZacianVSTAR = ZacianVSTAR;
