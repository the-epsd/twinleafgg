"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rayquazaex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Rayquazaex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = L;
        this.hp = 110;
        this.retreat = [C, C];
        this.powers = [{
                name: 'Rage Aura',
                powerType: game_1.PowerType.POKEBODY,
                text: 'If you have more Prize cards left than your opponent, ignore all [C] Energy necessary to use Rayquaza ex\'s Special Circuit and Sky- high Claws attacks.'
            }];
        this.attacks = [{
                name: 'Special Circuit',
                cost: [L, C],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon.This attack does 30 damage to the Pokémon. If you choose a Pokémon that has any Poké - Powers or Poké - Bodies, this attack does 50 damage instead. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Sky-High Claws',
                cost: [L, L, C, C],
                damage: 70,
                text: ''
            }];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '97';
        this.name = 'Rayquaza ex';
        this.fullName = 'Rayquaza ex DF';
    }
    getColorlessReduction(state) {
        const player = game_1.StateUtils.findOwner(state, this.cards);
        const opponent = game_1.StateUtils.getOpponent(state, player);
        return player.getPrizeLeft() > opponent.getPrizeLeft() ? 2 : 0;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.POKEBODY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                console.log(effect.cost);
                return state;
            }
            const playerPrizes = player.getPrizeLeft();
            if (playerPrizes > opponent.getPrizeLeft()) {
                const costToRemove = 1;
                for (let i = 0; i < costToRemove; i++) {
                    const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                }
            }
            console.log(effect.cost);
            return state;
        }
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.POKEBODY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_b) {
                console.log(effect.cost);
                return state;
            }
            const playerPrizes = player.getPrizeLeft();
            if (playerPrizes > opponent.getPrizeLeft()) {
                const costToRemove = 2;
                for (let i = 0; i < costToRemove; i++) {
                    const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                }
            }
            console.log(effect.cost);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                var _a, _b;
                const targets = selected;
                const pokemonWithAbilities = [];
                // checking for poke-body
                const stubPowerEffectForActive = new game_effects_1.PowerEffect(opponent, {
                    name: 'test',
                    powerType: game_1.PowerType.POKEBODY,
                    text: ''
                }, targets[0].getPokemonCard());
                try {
                    store.reduceEffect(state, stubPowerEffectForActive);
                    if (targets[0].getPokemonCard() && ((_a = targets[0].getPokemonCard()) === null || _a === void 0 ? void 0 : _a.powers.length)) {
                        pokemonWithAbilities.push(targets[0].getPokemonCard());
                    }
                }
                catch (_c) {
                    // no abilities in active
                }
                // checking for poke-power
                const stubPowerEffectForActive2 = new game_effects_1.PowerEffect(opponent, {
                    name: 'test',
                    powerType: game_1.PowerType.POKEPOWER,
                    text: ''
                }, targets[0].getPokemonCard());
                try {
                    store.reduceEffect(state, stubPowerEffectForActive2);
                    if (targets[0].getPokemonCard() && ((_b = targets[0].getPokemonCard()) === null || _b === void 0 ? void 0 : _b.powers.length)) {
                        pokemonWithAbilities.push(targets[0].getPokemonCard());
                    }
                }
                catch (_d) {
                    // no abilities in active
                }
                targets.forEach(target => {
                    //base damage
                    let damageEffect = new attack_effects_1.DealDamageEffect(effect, 30);
                    // if target has poke body or poke power, damage = 50 
                    if (pokemonWithAbilities.length > 0) {
                        damageEffect = new attack_effects_1.DealDamageEffect(effect, 50);
                    }
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
                return state;
            });
        }
        return state;
    }
}
exports.Rayquazaex = Rayquazaex;
