"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dodrio = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Dodrio extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Doduo';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Zooming Draw',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, you may put 1 damage counter on this Pokémon. If you do, draw a card.'
            }];
        this.attacks = [
            {
                name: 'Balliastic Beak',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'This attack does 30 more damage for each damage counter on this Pokémon.'
            }
        ];
        this.set = '151';
        this.set2 = '151';
        this.setNumber = '85';
        this.name = 'Dodrio';
        this.fullName = 'Dodrio MEW';
        this.MAKE_IT_RAIN_MARKER = 'MAKE_IT_RAIN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            effect.damage = 10;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card !== this) {
                    return state;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                damageEffect.target = cardList;
                store.reduceEffect(state, damageEffect);
                // Draw 1 card
                player.deck.moveTo(player.hand, 1);
                return state;
            });
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
                // Get damage counters
                const damageCounters = effect.player.active.damage;
                // Calculate bonus damage
                const bonusDamage = 30 * damageCounters;
                // Add bonus to base damage  
                effect.damage += bonusDamage;
            }
            return state;
        }
        return state;
    }
}
exports.Dodrio = Dodrio;
