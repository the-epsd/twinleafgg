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
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.retreat = [C];
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
                cost: [G, C],
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
            const cardList = game_1.StateUtils.findCardList(state, this);
            const player = game_1.StateUtils.findOwner(state, cardList);
            // Check if this Kricketune is in play
            const isInPlay = player.active.cards.includes(this) || player.bench.some(b => b.cards.includes(this));
            if (!isInPlay) {
                return state;
            }
            // If HP boost already applied, skip
            if (effect.hpBoosted) {
                return state;
            }
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (pokemonList) => {
                const pokemonCard = pokemonList.getPokemonCard();
                if (pokemonCard && pokemonCard.cardType === game_1.CardType.GRASS && pokemonCard.name !== 'Kricketune') {
                    effect.hp += 40;
                    effect.hpBoosted = true;
                }
            });
        }
        return state;
    }
}
exports.Kricketune = Kricketune;
