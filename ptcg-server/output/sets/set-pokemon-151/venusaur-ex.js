"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venusaurex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
function* useDangerousToxwhip(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED, card_types_1.SpecialCondition.POISONED]);
    specialConditionEffect.target = opponent.active;
    state = store.reduceEffect(state, specialConditionEffect);
    return state;
}
class Venusaurex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 340;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Tranquil Flower',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is in the Active' +
                    'Spot, you may heal 60 damage from I of your Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Dangerous Toxwhip',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 150,
                text: 'Your opponent\'s Active Pokémon is now Confused and' +
                    'Poisoned.'
            }
        ];
        this.set = '151';
        this.name = 'Venusaur ex';
        this.fullName = 'Venusaur ex MEW 003';
        this.TRANQUIL_FLOWER_MARKER = 'TRANQUIL_FLOWER_MARKER';
    }
    reduceEffect(store, state, effect) {
        let newState = state;
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList !== player.active) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.TRANQUIL_FLOWER_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            newState = store.prompt(newState, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, player.id, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: true }), selected => {
                const target = selected;
                if (!target) {
                    return;
                }
                let damageEffect;
                if (effect instanceof attack_effects_1.HealTargetEffect) {
                    damageEffect = effect;
                }
                else {
                    damageEffect = new attack_effects_1.HealTargetEffect(effect, 60);
                }
                damageEffect.target = target;
                const newState = store.reduceEffect(state, damageEffect);
                player.marker.addMarker(this.TRANQUIL_FLOWER_MARKER, this);
                return newState;
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.TRANQUIL_FLOWER_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useDangerousToxwhip(() => generator.next(), store, newState, effect);
            newState = generator.next().value;
        }
        return newState;
    }
}
exports.Venusaurex = Venusaurex;
