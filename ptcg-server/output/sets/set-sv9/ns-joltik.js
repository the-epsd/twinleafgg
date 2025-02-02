"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NsJoltik = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class NsJoltik extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.NS];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Crackling Short',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Before doing damage, discard all Pokémon Tool cards from your opponent’s Active Pokémon. If you discarded a Pokémon Tool card in this way, your opponent’s Active Pokémon is now Paralyzed.'
            }
        ];
        this.set = 'SV9';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.name = 'N\'s Joltik';
        this.fullName = 'N\'s Joltik SV9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.tool && opponent.active.tool !== undefined) {
                opponent.active.moveCardTo(opponent.active.tool, opponent.discard);
                const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                return store.reduceEffect(state, specialCondition);
            }
        }
        return state;
    }
}
exports.NsJoltik = NsJoltik;
