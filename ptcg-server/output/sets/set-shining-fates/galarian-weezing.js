"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalarianWeezing = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
class GalarianWeezing extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.regulationMark = 'D';
        this.cardType = card_types_1.CardType.DARK;
        this.evolvesFrom = 'Koffing';
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Neutralizing Gas',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is in the Active Spot, your opponent\'s Pokémon in play have no Abilities, except for Neutralizing Gas.'
            }];
        this.attacks = [{
                name: 'Severe Poison',
                cost: [card_types_1.CardType.DARK],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Poisoned. Put 4 damage counters instead of 1 on that Pokémon during Pokémon Checkup.'
            }];
        this.set = 'SHF';
        this.name = 'Galarian Weezing';
        this.fullName = 'Galarian Weezing SHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
            specialCondition.poisonDamage = 40;
            store.reduceEffect(state, specialCondition);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === pokemon_types_1.PowerType.ABILITY && effect.power.name !== 'Neutralizing Gas') {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const cardList = state_utils_1.StateUtils.findCardList(state, this);
            const owner = state_utils_1.StateUtils.findOwner(state, cardList);
            if (!player.active.cards.includes(this) &&
                !opponent.active.cards.includes(this)) {
                return state;
            }
            if (owner === player) {
                return state;
            }
            // Try reducing ability for opponent
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            if (!effect.power.exemptFromAbilityLock) {
                throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        return state;
    }
}
exports.GalarianWeezing = GalarianWeezing;
