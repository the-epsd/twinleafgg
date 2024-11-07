"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Moltres = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Moltres extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 120;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Flare Symbol',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your Basic [R] Pokémon\'s attacks, except any Moltres, do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Fire Wing',
                cost: [R, R, C],
                damage: 110,
                text: ''
            }
        ];
        this.regulationMark = 'F';
        this.set = 'PGO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Moltres';
        this.fullName = 'Moltres PGO';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
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
            catch (_c) {
                return state;
            }
            const hasMoltresInPlay = player.bench.some(b => b.cards.includes(this)) || player.active.cards.includes(this);
            let numberOfMoltresInPlay = 0;
            if (hasMoltresInPlay) {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                    if (cardList.cards.includes(this)) {
                        numberOfMoltresInPlay++;
                    }
                });
            }
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(player.active);
            store.reduceEffect(state, checkPokemonTypeEffect);
            if (checkPokemonTypeEffect.cardTypes.includes(R) && effect.target === opponent.active) {
                if (((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) !== 'Moltres' && ((_b = effect.player.active.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.stage) === card_types_1.Stage.BASIC) {
                    effect.damage += 10 * numberOfMoltresInPlay;
                }
            }
        }
        return state;
    }
}
exports.Moltres = Moltres;
