"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mightyena = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
class Mightyena extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Poochyena';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.abilities = [{
                name: 'Hustle Bark',
                powerType: game_1.PowerType.ABILITY,
                text: 'If your opponent has any Pokémon VMAX in play, this Pokémon\'s attacks cost [C][C][C] less.'
            }];
        this.attacks = [{
                name: 'Wild Tackle',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 160,
                text: 'This Pokémon also does 50 damage to itself.'
            }];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Mightyena';
        this.fullName = 'Mightyena ASR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(effect.player);
            store.reduceEffect(state, checkEnergy);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && opponentActive.tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                this.attacks[0].cost = [];
            }
        }
        return state;
    }
}
exports.Mightyena = Mightyena;
