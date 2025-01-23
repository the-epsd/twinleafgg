"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScovillainEXSSP = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class ScovillainEXSSP extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Capsakid';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 260;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Double Type',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokemon is in play, it is [G] and [R] type.'
            }];
        this.attacks = [
            {
                name: 'Spicy Rage',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 10,
                text: 'This attack does 70 more damage for each damage counter on this Pokemon.'
            }
        ];
        this.set = 'SSP';
        this.setNumber = '37';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Scovillain ex';
        this.fullName = 'Scovillain ex SSP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            effect.damage += player.active.damage * 7;
        }
        if (effect instanceof check_effects_1.CheckPokemonTypeEffect && effect.target.getPokemonCard() === this) {
            effect.cardTypes = [card_types_1.CardType.FIRE, card_types_1.CardType.GRASS];
            return state;
        }
        return state;
    }
}
exports.ScovillainEXSSP = ScovillainEXSSP;
