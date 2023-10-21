"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dunsparce = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Dunsparce extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Mysterious Nest',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'C Pokémon in play (both yours and your opponent\'s) have no Weakness.'
            }];
        this.attacks = [
            {
                name: 'Rollout',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }
        ];
        this.regulationMark = 'G';
        this.set = 'PAL';
        this.set2 = 'paldeaevolved';
        this.setNumber = '157';
        this.name = 'Dudunsparce';
        this.fullName = 'Dudunsparce PAL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            if (effect instanceof check_effects_1.CheckPokemonStatsEffect) {
                const cardList = game_1.StateUtils.findCardList(state, effect.card);
                if (cardList instanceof game_1.PokemonCardList) {
                    const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(cardList);
                    store.reduceEffect(state, checkPokemonType);
                }
                // We are not blocking the Abilities from Non-Basic Pokemon
                if (effect.card.cardType !== card_types_1.CardType.COLORLESS) {
                    return state;
                }
                else {
                    effect.weakness = [];
                }
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.Dunsparce = Dunsparce;
