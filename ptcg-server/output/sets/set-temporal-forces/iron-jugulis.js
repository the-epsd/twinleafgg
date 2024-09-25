"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronJugulis = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class IronJugulis extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.regulationMark = 'H';
        this.tags = [game_1.CardTag.FUTURE];
        this.cardType = game_1.CardType.COLORLESS;
        this.hp = 130;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Blasting Wind',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 110,
                text: ''
            }
        ];
        this.powers = [{
                name: 'Automated Combat',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is damaged by an attack from your opponent\'s Pokémon(even if this Pokémon is Knocked Out), put 3 damage counters on the Attacking Pokémon.'
            }];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '139';
        this.name = 'Iron Jugulis';
        this.fullName = 'Iron Jugulis TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect || effect instanceof attack_effects_1.DealDamageEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (effect.target !== cardList) {
                return state;
            }
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            const oppActive = effect.source;
            oppActive.damage += 30;
        }
        return state;
    }
}
exports.IronJugulis = IronJugulis;
