"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lurantis = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Lurantis extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Fomantis';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Sunny Day',
                powerType: game_1.PowerType.ABILITY,
                text: 'The attacks of your [G] Pokémon and [R] Pokémon do 20 more damage to your opponent\'s Active Pokémon(before applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Solar Beam',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: ''
            }];
        this.set = 'SMP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'SM25';
        this.name = 'Lurantis';
        this.fullName = 'Lurantis SMP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
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
            const hasLurantisInPlay = player.bench.some(b => b.cards.includes(this)) || player.active.cards.includes(this);
            let numberOfLurantisInPlay = 0;
            if (hasLurantisInPlay) {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                    if (cardList.cards.includes(this)) {
                        numberOfLurantisInPlay++;
                    }
                });
            }
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(player.active);
            store.reduceEffect(state, checkPokemonTypeEffect);
            if ((checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.GRASS) || checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.FIRE)) && effect.target === opponent.active) {
                effect.damage += 20 * numberOfLurantisInPlay;
            }
        }
        return state;
    }
}
exports.Lurantis = Lurantis;
