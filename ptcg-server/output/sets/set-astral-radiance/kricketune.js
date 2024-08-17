"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kricketune = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Kricketune extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
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
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Kricketune';
        this.fullName = 'Kricketune ASR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckHpEffect) {
            const player = effect.player;
            let kricketunesInPlay = false;
            let swellingTuneApplied = false;
            if (swellingTuneApplied) {
                return state;
            }
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                var _a;
                if (((_a = cardList.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) === 'Kricketune') {
                    kricketunesInPlay = true;
                }
            });
            if (kricketunesInPlay) {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    const pokemonCard = cardList.getPokemonCard();
                    if (pokemonCard && pokemonCard.cardType === game_1.CardType.GRASS && pokemonCard.name !== 'Kricketune') {
                        effect.hp += 40;
                        swellingTuneApplied = true;
                    }
                });
            }
        }
        return state;
    }
}
exports.Kricketune = Kricketune;
