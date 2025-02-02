"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Miloticex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Miloticex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Feebas';
        this.cardType = game_1.CardType.WATER;
        this.hp = 270;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.resistance = [];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.powers = [{
            name: 'Sparkling Scales',
            powerType: game_1.PowerType.ABILITY,
            text: 'Prevent all damage and effects done to this Pokémon by your opponent\'s Tera Pokémon\'s attacks.'
        }];
        this.attacks = [{
            name: 'Hypno Splash',
            cost: [game_1.CardType.WATER, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
            damage: 160,
            text: 'Your opponent\'s Active Pokémon is now Asleep.'
        }];
        this.regulationMark = 'H';
        this.set = 'SV8';
        this.setNumber = '26';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Milotic ex';
        this.fullName = 'Milotic ex SV8';
    }
    reduceEffect(store, state, effect) {
        // if (effect instanceof BetweenTurnsEffect) {
        //   const player = effect.player;
        //   player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        //     if (cardList.getPokemonCard() === this && cardList.marker.markers.length > 0) {
        //       cardList.clearAttackEffects();
        //       cardList.clearEffects();
        //     }
        //   });
        // }
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const attackingPokemon = player.active.getPokemonCard();
            if (attackingPokemon && attackingPokemon.tags.includes(game_1.CardTag.POKEMON_TERA)) {
                effect.attack.damage = 0;
                effect.preventDefault = true;
            }
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const sourcePokemon = player.active.getPokemonCard();
            if (sourcePokemon && sourcePokemon.tags.includes(game_1.CardTag.POKEMON_TERA)) {
                effect.damage = 0;
                effect.preventDefault = true;
            }
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const sourcePokemon = player.active.getPokemonCard();
            if (sourcePokemon && sourcePokemon.tags.includes(game_1.CardTag.POKEMON_TERA)) {
                effect.damage = 0;
                effect.preventDefault = true;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [game_1.SpecialCondition.ASLEEP]);
            state = store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Miloticex = Miloticex;
