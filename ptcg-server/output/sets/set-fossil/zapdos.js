"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zapdos = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Zapdos extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 80;
        this.weakness = [];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Thunderstorm',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING],
                damage: 40,
                text: 'For each of your opponent\'s Benched Pokémon, flip a coin. If heads, this attack does 20 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Then, Zapdos does 10 damage times the number of tails to itself.'
            }
        ];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
        this.name = 'Zapdos';
        this.fullName = 'Zapdos FO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let tailsCount = 0;
            opponent.bench.forEach(target => {
                state = store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), flipResult => {
                    if (flipResult) {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                        damageEffect.target = target;
                        store.reduceEffect(state, damageEffect);
                    }
                    else {
                        tailsCount++;
                    }
                });
            });
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 10 * tailsCount);
            dealDamage.target = player.active;
            store.reduceEffect(state, dealDamage);
            return state;
        }
        return state;
    }
}
exports.Zapdos = Zapdos;
