"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Victini = void 0;
const __1 = require("../..");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Victini extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Flare',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }
        ];
        this.powers = [{
                name: 'Victory Cheer',
                useWhenInPlay: false,
                powerType: __1.PowerType.ABILITY,
                text: 'Attacks used by your Evolution [R] Pokémon do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.set = 'SSP';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Victini';
        this.fullName = 'Victini SSP';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this))
                return state;
            const hasVictiniInPlay = player.bench.some(b => b.cards.includes(this)) || player.active.cards.includes(this);
            let numberOfVictiniInPlay = 0;
            if (hasVictiniInPlay) {
                player.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                    if (cardList.cards.includes(this)) {
                        numberOfVictiniInPlay++;
                    }
                });
            }
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(player.active);
            store.reduceEffect(state, checkPokemonTypeEffect);
            if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.FIRE) && effect.target === opponent.active) {
                if (((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) !== 'Victini' && ((_b = effect.player.active.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.stage) === card_types_1.Stage.STAGE_1) {
                    effect.damage += 10 * numberOfVictiniInPlay;
                }
            }
        }
        return state;
    }
}
exports.Victini = Victini;
