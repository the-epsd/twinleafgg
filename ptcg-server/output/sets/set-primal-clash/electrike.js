"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Electrike = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Electrike extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Ω Barrier',
                powerType: game_1.PowerType.ANCIENT_TRAIT,
                text: 'Whenever your opponent plays a Trainer card (excluding Pokémon Tools and Stadium cards), prevent all effects of that card done to this Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Thunder Fang',
                cost: [L],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            },
        ];
        this.set = 'PRC';
        this.setNumber = '60';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Electrike';
        this.fullName = 'Electrike PRC';
    }
    reduceEffect(store, state, effect) {
        var _a, _b, _c, _d;
        if (effect instanceof play_card_effects_1.TrainerTargetEffect &&
            effect.target &&
            ((_b = (_a = effect.target) === null || _a === void 0 ? void 0 : _a.cards) === null || _b === void 0 ? void 0 : _b.includes(this)) &&
            !(((_c = effect.trainerCard) === null || _c === void 0 ? void 0 : _c.trainerType) === card_types_1.TrainerType.TOOL || ((_d = effect.trainerCard) === null || _d === void 0 ? void 0 : _d.trainerType) === card_types_1.TrainerType.STADIUM)) {
            const targetCard = effect.target.getPokemonCard();
            if (targetCard && targetCard.fullName === this.fullName) {
                effect.target = undefined;
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, (result => {
                if (result) {
                    attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
                }
            }));
        }
        return state;
    }
}
exports.Electrike = Electrike;
