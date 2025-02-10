"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swoobat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Swoobat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Woobat';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Supersonic',
                cost: [C],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            },
            {
                name: 'Charming Stamp',
                cost: [P],
                damage: 0,
                text: 'Your opponent chooses 1 of their own Pokémon. This attack does 90 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
        ];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.name = 'Swoobat';
        this.fullName = 'Swoobat CEC';
    }
    reduceEffect(store, state, effect) {
        // Supersonic
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
        // Charming Stamp
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const opponent = effect.opponent;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.DealDamageEffect(effect, 90);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Swoobat = Swoobat;
