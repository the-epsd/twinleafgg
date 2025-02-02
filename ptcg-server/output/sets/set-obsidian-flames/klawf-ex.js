"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Klawfex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Klawfex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 220;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Counterattacking Pincer',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if this Pokémon is Knocked Out), discard an Energy from the Attacking Pokémon.'
            }
        ];
        this.attacks = [{
                name: 'Falling Press',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 80 more damage.'
            }];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '157';
        this.name = 'Klawf ex';
        this.fullName = 'Klawf ex OBF';
        //   public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
        //     if (effect instanceof AfterDamageEffect)
    }
}
exports.Klawfex = Klawfex;
