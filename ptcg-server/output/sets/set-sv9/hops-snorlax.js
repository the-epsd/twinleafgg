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
                name: 'Big Belly',
                powerType: game_1.PowerType.ABILITY,
                text: 'The attacks of your Hop\'s Pokémon do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance). The effect of Big Belly doesn\'t stack.'
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
        this.set = 'SV9';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
        this.name = 'Hop\'s Snorlax';
        this.fullName = 'Hop\'s Snorlax SV9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 80);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
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
            const hasSnorlaxInPlay = player.bench.some(b => b.cards.includes(this)) || player.active.cards.includes(this);
            let isSnorlaxInPlay = false;
            if (hasSnorlaxInPlay) {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                    if (cardList.cards.includes(this)) {
                        isSnorlaxInPlay = true;
                    }
                });
            }
            const hopsPokemon = player.active.getPokemonCard();
            if (isSnorlaxInPlay && hopsPokemon && hopsPokemon.tags.includes(card_types_1.CardTag.HOPS) && effect.target === opponent.active) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.HopsSnorlax = HopsSnorlax;
