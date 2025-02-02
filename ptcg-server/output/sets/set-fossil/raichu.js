"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raichu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Raichu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pikachu';
        this.evolvesTo = ['Raichu BREAK', 'Raichu LV.X'];
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Gigashock',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING],
                damage: 30,
                text: 'Choose 3 of your opponent\'s Benched Pokémon and this attack does 10 damage to each of them. (Don\'t apply Weakness and Resistance for Benched Pokémon.) If your opponent has fewer than 3 Benched Pokémon, do the damage to each of them.'
            }
        ];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '14';
        this.name = 'Raichu';
        this.fullName = 'Raichu FO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            if (opponentBenched < 3) {
                opponent.bench.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
                return state;
            }
            else {
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 3, allowCancel: false }), targets => {
                    if (!targets || targets.length === 0) {
                        return;
                    }
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                    damageEffect.target = targets[0];
                    store.reduceEffect(state, damageEffect);
                });
            }
        }
        return state;
    }
}
exports.Raichu = Raichu;
