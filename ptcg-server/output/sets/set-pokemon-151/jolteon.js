"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jolteon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Jolteon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Linear Attack',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 0,
                text: 'This attack does 30 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Fighting Lightning',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is a Pokémon ex or Pokémon V, this attack does 90 more damage.'
            }
        ];
        this.set = 'MEW';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '135';
        this.name = 'Jolteon';
        this.fullName = 'Jolteon MEW';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && (opponentActive.tags.includes(card_types_1.CardTag.POKEMON_V || card_types_1.CardTag.POKEMON_VSTAR || card_types_1.CardTag.POKEMON_VMAX || card_types_1.CardTag.POKEMON_ex))) {
                effect.damage += 90;
            }
        }
        return state;
    }
}
exports.Jolteon = Jolteon;
