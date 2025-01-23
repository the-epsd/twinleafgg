"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Incineroarex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Incineroarex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Torracat';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 320;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Hustle Play',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'Attacks used by this Pokémon cost [C] less for each of your opponent\'s Benched Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Blaze Blast',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 240,
                text: 'Your opponent\'s Active Pokémon is now Burned.'
            }
        ];
        this.set = 'TEF';
        this.setNumber = '34';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Incineroar ex';
        this.fullName = 'Incineroar ex TEF';
    }
    reduceEffect(store, state, effect) {
        // Hustle Play
        if (effect instanceof check_effects_1.CheckAttackCostEffect) {
            const player = effect.player;
            if (effect.player !== player || player.active.getPokemonCard() !== this) {
                return state;
            }
            // i love checking for ability lock woooo
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
            effect.cost.splice(index, benched);
            return state;
        }
        // Blaze Blast
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.BURNED]);
            return store.reduceEffect(state, specialCondition);
        }
        return state;
    }
}
exports.Incineroarex = Incineroarex;
