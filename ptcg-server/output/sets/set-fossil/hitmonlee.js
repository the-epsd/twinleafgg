"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hitmonlee = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Hitmonlee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Stretch Kick',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 0,
                text: 'If your opponent has any Benched Pokémon, choose 1 of them and this attack does 20 damage to it. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'High Jump Kick',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Hitmonlee';
        this.fullName = 'Hitmonlee FO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Hitmonlee = Hitmonlee;
