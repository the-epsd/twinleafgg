"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Azumarill = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Azumarill extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Marill';
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Sparkly Bubbles',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you have a Tera Pokémon in play, this Pokémon\'s Double Edge attack can be used for 1 Psychic Energy.'
            }];
        this.attacks = [
            {
                name: 'Double Edge',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 230,
                text: 'This Pokémon does 50 damage to itself.'
            }
        ];
        this.set = 'SSP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.name = 'Azumarill';
        this.fullName = 'Azumarill svLN';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let hasTeraPokemonInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.tags.includes(card_types_1.CardTag.POKEMON_TERA)) {
                    hasTeraPokemonInPlay = true;
                }
            });
            if (hasTeraPokemonInPlay) {
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: game_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    console.log(effect.cost);
                    return state;
                }
                const index = effect.cost.indexOf(card_types_1.CardType.PSYCHIC);
                // No cost to reduce
                if (index === -1) {
                    return state;
                }
                // Remove all PSYCHIC energy from the cost
                while (effect.cost.includes(card_types_1.CardType.PSYCHIC)) {
                    const psychicIndex = effect.cost.indexOf(card_types_1.CardType.PSYCHIC);
                    effect.cost.splice(psychicIndex, 3);
                }
            }
            console.log(effect.cost);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 50);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.Azumarill = Azumarill;
