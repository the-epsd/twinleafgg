"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Articuno = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Articuno extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 120;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Ice Float',
                powerType: game_1.PowerType.ABILITY,
                text: ' If this Pokémon has any W Energy attached, it has no Retreat Cost. '
            }];
        this.attacks = [{
                name: 'Blizzard',
                cost: [W, W, W],
                damage: 110,
                text: 'This attack also does 10 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'MEW';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '144';
        this.name = 'Articuno';
        this.fullName = 'Articuno MEW';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            // Check to see if anything is blocking our Ability
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
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                    state = store.reduceEffect(state, checkProvidedEnergy);
                    checkProvidedEnergy.energyMap.forEach(energy => {
                        if (energy.provides.includes(card_types_1.CardType.WATER)) {
                            effect.cost = [];
                            return state;
                        }
                        if (energy.provides.includes(card_types_1.CardType.ANY)) {
                            effect.cost = [];
                            return state;
                        }
                    });
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const opponent = effect.opponent;
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            benched.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Articuno = Articuno;
