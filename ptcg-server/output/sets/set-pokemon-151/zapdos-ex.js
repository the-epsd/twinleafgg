"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zapdosex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Zapdosex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 200;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Voltaic Float',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'If this Pokémon has any Lightning Energy attached, it has no ' +
                    'Retreat Cost.'
            }];
        this.attacks = [{
                name: 'Multishot Lightning',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING],
                damage: 120,
                text: 'This attack also does 90 damage to 1 of your opponent\'s Benched Pokémon that has any damage counters on it. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '145';
        this.name = 'Zapdos ex';
        this.fullName = 'Zapdos ex MEW';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.getPokemonCard() === this) {
            const player = effect.player;
            // Check to see if anything is blocking our Ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            state = store.reduceEffect(state, checkProvidedEnergy);
            checkProvidedEnergy.energyMap.forEach(energy => {
                if (energy.provides.includes(card_types_1.CardType.LIGHTNING) || energy.provides.includes(card_types_1.CardType.ANY)) {
                    const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index !== -1) {
                        effect.cost.splice(index, 2);
                    }
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const damagedBenchedPokemon = opponent.bench.filter(b => b.cards.length > 0 && b.damage > 0);
            if (damagedBenchedPokemon.length === 0) {
                return state;
            }
            const blocked = [];
            opponent.bench.forEach((b, index) => {
                if (b.damage === 0) {
                    blocked.push({ player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.BENCH, index });
                }
            });
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false, blocked }), target => {
                if (!target || target.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 90);
                damageEffect.target = target[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Zapdosex = Zapdosex;
