"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HopsSnorlax = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class HopsSnorlax extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.HOPS];
        this.cardType = C;
        this.hp = 150;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Extra Helpings',
                powerType: game_1.PowerType.ABILITY,
                text: 'Attacks used by your Hop\'s Pokémon do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance). The effect of Extra Helpings doesn\'t stack.'
            }];
        this.attacks = [
            {
                name: 'Dynamic Press',
                cost: [C, C, C],
                damage: 140,
                text: 'This Pokémon also does 80 damage to itself.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'JTG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '117';
        this.name = 'Hop\'s Snorlax';
        this.fullName = 'Hop\'s Snorlax JTG';
        this.bigBellyApplied = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 80);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && game_1.StateUtils.isPokemonInPlay(effect.player, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hopsPokemon = player.active.getPokemonCard();
            // Count number of Hop's Snorlax in play
            let snorlaxCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Hop\'s Snorlax') {
                    snorlaxCount++;
                }
            });
            // Only proceed if there's at least one Snorlax
            if (snorlaxCount === 0) {
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
            // Apply the effect only once, regardless of how many Snorlax are in play
            if (hopsPokemon && hopsPokemon.tags.includes(card_types_1.CardTag.HOPS) &&
                effect.target === opponent.active &&
                !effect.damageIncreased) {
                effect.damage += 30;
                effect.damageIncreased = true;
            }
        }
        return state;
    }
}
exports.HopsSnorlax = HopsSnorlax;
