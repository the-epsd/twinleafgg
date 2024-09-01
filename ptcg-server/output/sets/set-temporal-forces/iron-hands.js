"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronHands = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class IronHands extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Volt Wave',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            },
            {
                name: 'Superalloy Hands',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 80,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is a Pokémon ex or Pokémon V, this attack does 80 more damage.'
            }
        ];
        this.set = 'TEF';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Iron Hands';
        this.fullName = 'Iron Hands TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), flipResult => {
                if (flipResult) {
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    store.reduceEffect(state, specialConditionEffect);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && (opponentActive.tags.includes(card_types_1.CardTag.POKEMON_V || card_types_1.CardTag.POKEMON_VSTAR || card_types_1.CardTag.POKEMON_VMAX || card_types_1.CardTag.POKEMON_ex))) {
                effect.damage += 80;
            }
        }
        return state;
    }
}
exports.IronHands = IronHands;
