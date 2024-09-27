"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kricketune = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Kricketune extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.evolvesFrom = 'Kricketot';
        this.cardType = game_1.CardType.GRASS;
        this.hp = 90;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Swelling Tune',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your [G] Pokémon in play, except any Kricketune, get +40 HP. You can\'t apply more than 1 Swelling Tune Ability at a time.'
            }
        ];
        this.attacks = [
            {
                name: 'Slash',
                cost: [game_1.CardType.GRASS, game_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'ASR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Kricketune';
        this.fullName = 'Kricketune ASR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckHpEffect) {
            const player = effect.player;
            let abilityApplied = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                var _a;
                if (!abilityApplied && ((_a = cardList.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) === 'Kricketune') {
                    abilityApplied = true;
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, innerCardList => {
                        const pokemonCard = innerCardList.getPokemonCard();
                        if (pokemonCard && pokemonCard.cardType === game_1.CardType.GRASS && pokemonCard.name !== 'Kricketune') {
                            effect.hp += 40;
                        }
                    });
                }
            });
        }
        return state;
    }
}
exports.Kricketune = Kricketune;
