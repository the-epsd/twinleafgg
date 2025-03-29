"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoltresZapdosArticunoGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class MoltresZapdosArticunoGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_GX, card_types_1.CardTag.TAG_TEAM];
        this.cardType = C;
        this.hp = 300;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Trinity Burn',
                cost: [R, W, L, C],
                damage: 210,
                text: ''
            },
            {
                name: 'Sky Legends-GX',
                cost: [C],
                damage: 0,
                text: 'Shuffle this Pokémon and all cards attached to it into your deck. If this Pokémon has at least 1 extra [R], [W], and [L] Energy attached to it (in addition to this attack\'s cost), this attack does 110 damage to 3 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'HIF';
        this.setNumber = '44';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Moltres & Zapdos & Articuno-GX';
        this.fullName = 'Moltres & Zapdos & Articuno-GX HIF';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            prefabs_1.BLOCK_IF_GX_ATTACK_USED(player);
            player.usedGX = true;
            // Check for the extra energy cost.
            const extraEffectCost = [R, W, L, C];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (meetsExtraEffectCost) {
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 3, allowCancel: false }), selected => {
                    const targets = selected || [];
                    targets.forEach(target => {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, 110);
                        damageEffect.target = target;
                        state = store.reduceEffect(state, damageEffect);
                    });
                    attack_effects_2.SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(store, state, effect);
                    return state;
                });
            }
            else {
                attack_effects_2.SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(store, state, effect);
            }
        }
        return state;
    }
}
exports.MoltresZapdosArticunoGX = MoltresZapdosArticunoGX;
