"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reshiram = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Reshiram extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Scorching Wind',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 20 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Black Flame',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'If Zekrom is on your Bench, this attack does 80 more damage.'
            }];
        this.set = 'CEL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.name = 'Reshiram';
        this.fullName = 'Reshiram CEL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            benched.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const zekrom = player.bench.some(c => { var _a; return ((_a = c.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) === 'Zekrom'; });
            if (zekrom) {
                effect.damage += 80;
            }
        }
        return state;
    }
}
exports.Reshiram = Reshiram;
