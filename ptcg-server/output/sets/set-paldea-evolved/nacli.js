"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nacli = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Nacli extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Salt Coating',
                cost: [F],
                damage: 0,
                text: 'Heal 20 damage from 1 of your Pokémon.'
            },
            {
                name: 'Slashing Strike',
                cost: [F, F],
                damage: 30,
                text: ''
            }];
        this.set = 'PAL';
        this.name = 'Nacli';
        this.fullName = 'Nacli PAL';
        this.setNumber = '121';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Salt Coating
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            return store.prompt(state, new game_1.ChoosePokemonPrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const healEffect = new attack_effects_1.HealTargetEffect(effect, 20);
                healEffect.target = targets[0];
                store.reduceEffect(state, healEffect);
            });
        }
        return state;
    }
}
exports.Nacli = Nacli;
