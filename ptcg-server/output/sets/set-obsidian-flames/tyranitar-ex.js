"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tyranitarex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Tyranitarex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Pupitar';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.cardType = L;
        this.hp = 340;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Mountain Hurl',
                cost: [F],
                damage: 120,
                text: 'Discard the top 2 cards of your deck.'
            },
            {
                name: 'Lightning Rampage',
                cost: [F, F],
                damage: 150,
                damageCalculation: '+',
                text: 'If your Benched Pokémon have any damage counters on them, this attack does 100 more damage.'
            },
        ];
        this.set = 'OBF';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.name = 'Tyranitar ex';
        this.fullName = 'Tyranitar ex OBF';
    }
    reduceEffect(store, state, effect) {
        // Mountain Hurl
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.deck.moveTo(player.discard, 2);
        }
        // Lightning Rampage
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // checking if this pokemon is in play
            let isThereDamage = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList === player.active) {
                    return;
                }
                if (cardList.damage > 0) {
                    isThereDamage = true;
                }
            });
            if (isThereDamage) {
                effect.damage += 100;
            }
        }
        return state;
    }
}
exports.Tyranitarex = Tyranitarex;
