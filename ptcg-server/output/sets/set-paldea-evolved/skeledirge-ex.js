"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skeledirgeex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Skeledirgeex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Crocalor';
        this.cardType = R;
        this.hp = 340;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Vitality Song',
                cost: [R],
                damage: 50,
                text: 'Heal 30 damage from each of your Pokémon.'
            },
            {
                name: 'Burning Voice',
                cost: [R, R],
                damage: 270,
                damageCalculation: '-',
                text: 'This attack does 10 less damage for each damage counter on this Pokémon.'
            },
        ];
        this.set = 'PAL';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.name = 'Skeledirge ex';
        this.fullName = 'Skeledirge ex PAL';
    }
    reduceEffect(store, state, effect) {
        // Vitality Song
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const healing = new attack_effects_1.HealTargetEffect(effect, 30);
                healing.target = cardList;
                store.reduceEffect(state, healing);
            });
        }
        // Burning Voice
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            effect.damage -= effect.player.active.damage;
        }
        return state;
    }
}
exports.Skeledirgeex = Skeledirgeex;
