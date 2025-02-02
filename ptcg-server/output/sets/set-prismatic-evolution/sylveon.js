"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sylveon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const game_3 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sylveon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = P;
        this.hp = 120;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.powers = [{
                name: 'Safeguard',
                powerType: game_1.PowerType.ABILITY,
                text: 'Prevent all damage done to this Pokémon by attacks from your opponent\'s Pokémon ex.'
            }];
        this.attacks = [{ name: 'Magical Shot', cost: [P, C, C], damage: 100, text: '' }];
        this.set = 'PRE';
        this.setNumber = '40';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sylveon';
        this.fullName = 'Sylveon PRE';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            const player = game_3.StateUtils.findOwner(state, effect.target);
            const opponent = game_3.StateUtils.findOwner(state, effect.source);
            if (player === opponent || pokemonCard !== this || sourceCard === undefined || state.phase !== game_2.GamePhase.ATTACK)
                return state;
            if (sourceCard.tags.includes(card_types_1.CardTag.POKEMON_ex) && !prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this))
                effect.preventDefault = true;
        }
        return state;
    }
}
exports.Sylveon = Sylveon;
