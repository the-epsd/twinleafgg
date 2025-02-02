"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RapidStrikeScrollOfSwirls = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class RapidStrikeScrollOfSwirls extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.tags = [card_types_1.CardTag.RAPID_STRIKE];
        this.regulationMark = 'E';
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '131';
        this.name = 'Rapid Strike Scroll of Swirls';
        this.fullName = 'Rapid Strike Scroll of Swirls BST';
        this.attacks = [{
                name: 'Matchless Maelstrom',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 30 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.text = 'The Rapid Strike Pokémon this card is attached to can use the attack on this card. (You still need the necessary Energy to use this attack.)';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect && ((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tools.includes(this)) &&
            !effect.attacks.includes(this.attacks[0])) {
            effect.attacks.push(this.attacks[0]);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (!player.active.cards.some(c => c instanceof game_1.PokemonCard && c.tags.includes(card_types_1.CardTag.RAPID_STRIKE))) {
                return state;
            }
            const opponent = effect.opponent;
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            effect.damage = 30;
            benched.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.RapidStrikeScrollOfSwirls = RapidStrikeScrollOfSwirls;
