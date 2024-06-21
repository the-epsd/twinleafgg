"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kricketune = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Kricketune extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Kricketot';
        this.cardType = game_1.CardType.GRASS;
        this.hp = 90;
        this.powers = [
            {
                name: 'Swelling Tune',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: false,
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
        this.SWELLING_TUNE_MARKER = 'SWELLING_TUNE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckHpEffect && effect.player.bench.some(b => b.cards.includes(this))) {
            const player = effect.player;
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                    cardList.marker.removeMarker(this.SWELLING_TUNE_MARKER, this);
                });
                return state;
            }
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(cardList);
                store.reduceEffect(state, checkPokemonTypeEffect);
                if (checkPokemonTypeEffect.cardTypes.includes(game_1.CardType.GRASS) && !cardList.marker.hasMarker(this.SWELLING_TUNE_MARKER) &&
                    !cardList.cards.includes(this)) {
                    cardList.hp += 40;
                    cardList.marker.addMarker(this.SWELLING_TUNE_MARKER, this);
                }
            });
            return state;
        }
        return state;
    }
}
exports.Kricketune = Kricketune;
