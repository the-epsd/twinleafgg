"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machamp = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_1 = require("../../game/store/state/state");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Machamp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.set = 'BS';
        this.fullName = 'Machamp BS';
        this.name = 'Machamp';
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Machoke';
        this.hp = 100;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Strikes Back',
                powerType: pokemon_types_1.PowerType.POKEPOWER,
                text: 'Whenever your opponent\'s attack damages Machamp (even if Machamp is Knocked Out), this power does 10 damage to the attacking Pokémon. (Don\'t apply Weakness and Resistance.) This power can\'t be used if Machamp is Asleep, Confused, or Paralyzed when your opponent attacks.'
            }
        ];
        this.attacks = [
            {
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                name: 'Seismic Toss',
                damage: 60,
                text: ''
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList.specialConditions.length > 0) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
                return state;
            }
            if (state.phase === state_1.GamePhase.ATTACK) {
                effect.source.damage += 10;
            }
        }
        return state;
    }
}
exports.Machamp = Machamp;
