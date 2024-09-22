"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachuex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Pikachuex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_ex, game_1.CardTag.POKEMON_TERA];
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.LIGHTNING;
        this.hp = 200;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Tenacious Heart',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon has full HP and would be Knocked Out by an attack, it isn\'t Knocked Out and its remaining HP becomes 10 instead.'
            }];
        this.attacks = [
            {
                name: 'Topaz Bolt',
                cost: [game_1.CardType.GRASS, game_1.CardType.LIGHTNING, game_1.CardType.METAL],
                damage: 300,
                text: 'Discard 3 Energy from this Pokémon.'
            },
        ];
        this.regulationMark = 'H';
        this.set = 'SV8';
        this.setNumber = '33';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Pikachu ex';
        this.fullName = 'Pikachu ex SV8';
        this.damageDealt = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const pokemonCard = effect.target.getPokemonCard();
            this.damageDealt = true;
            if (pokemonCard === this && this.damageDealt === true) {
                const checkHpEffect = new check_effects_1.CheckHpEffect(player, effect.target);
                store.reduceEffect(state, checkHpEffect);
                // Try to reduce PowerEffect, to check if something is blocking our ability
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
                if (effect.target.damage === 0 && effect.damage >= checkHpEffect.hp) {
                    effect.preventDefault = true;
                    effect.target.damage = checkHpEffect.hp - 10;
                }
                return state;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
        }
        return state;
    }
}
exports.Pikachuex = Pikachuex;
