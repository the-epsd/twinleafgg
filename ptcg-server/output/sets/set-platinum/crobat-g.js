"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrobatG = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_message_1 = require("../../game/game-message");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
function* useFlashBite(next, store, state, effect) {
    const player = effect.player;
    yield store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: true }), selected => {
        if (!selected || selected.length === 0) {
            return state;
        }
        const target = selected[0];
        target.damage += 10;
        next();
    });
    return state;
}
class CrobatG extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.tags = [card_types_1.CardTag.POKEMON_SP];
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [];
        this.powers = [{
                name: 'Flash Bite',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Crobat G from your hand ' +
                    'onto your Bench, you may put 1 damage counter on 1 of your ' +
                    'opponent\'s Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Toxic Fang',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'The Defending Pokémon is now Poisoned. Put 2 damage counters ' +
                    ' instead of 1 on the Defending Pokémon between turns.'
            }
        ];
        this.set = 'PL';
        this.name = 'Crobat G';
        this.fullName = 'Crobat G PL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '47';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const player = game_1.StateUtils.findOwner(state, effect.target);
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
            const generator = useFlashBite(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
            specialCondition.poisonDamage = 20;
            store.reduceEffect(state, specialCondition);
        }
        return state;
    }
}
exports.CrobatG = CrobatG;
