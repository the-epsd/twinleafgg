"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianArcanine = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class HisuianArcanine extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Hisuian Growlithe';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Proud Fangs',
                cost: [],
                damage: 30,
                text: 'If your Benched Pokémon have any damage counters on them, this attack does 90 more damage.'
            },
            {
                name: 'Searing Flame',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: 'Your opponent\'s Active Pokémon is now Burned.'
            }
        ];
        this.set = 'TWM';
        this.setNumber = '100';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Hisuian Arcanine';
        this.fullName = 'Hisuian Arcanine TWM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
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
                effect.damage += 90;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.BURNED]);
            return store.reduceEffect(state, specialCondition);
        }
        return state;
    }
}
exports.HisuianArcanine = HisuianArcanine;
