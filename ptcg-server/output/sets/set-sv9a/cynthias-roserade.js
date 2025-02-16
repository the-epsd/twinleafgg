"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CynthiasRoserade = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class CynthiasRoserade extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Cynthia\'s Roselia';
        this.tags = [card_types_1.CardTag.CYNTHIAS];
        this.cardType = G;
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Glorious Cheer',
                powerType: game_1.PowerType.ABILITY,
                text: 'Attacks from your Cynthia\'s Pokémon deal 30 more damage to your opponent\'s Active Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Leaf Steps',
                cost: [G, C, C],
                damage: 80,
                text: ''
            }
        ];
        this.regulationMark = 'I';
        this.set = 'SV9a';
        this.setNumber = '5';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cynthia\'s Roserade';
        this.fullName = 'Cynthia\'s Roserade SV9a';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && game_1.StateUtils.isPokemonInPlay(effect.player, this)) {
            const player = effect.player;
            const attackingCard = effect.source.getPokemonCard();
            prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this);
            if (attackingCard !== undefined && attackingCard.tags.includes(card_types_1.CardTag.CYNTHIAS)) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.CynthiasRoserade = CynthiasRoserade;
