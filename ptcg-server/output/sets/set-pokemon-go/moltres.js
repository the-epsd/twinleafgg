"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Moltres = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Moltres extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Flare Symbol',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Your Basic [R] Pokémon\'s attacks, except any Moltres, do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Fire Wing',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
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
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const legendaryBird = player.active.getPokemonCard();
            if (legendaryBird && legendaryBird.stage == card_types_1.Stage.BASIC && legendaryBird.cardType == card_types_1.CardType.FIRE) {
                if (effect instanceof attack_effects_1.DealDamageEffect) {
                    if (effect.card.name !== 'Moltres') {
                        // exclude Moltres
                        effect.damage += 10;
                    }
                    return state;
                }
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.Moltres = Moltres;
