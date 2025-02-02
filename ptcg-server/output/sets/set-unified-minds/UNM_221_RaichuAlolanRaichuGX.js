"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaichuAlolanRaichuGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class RaichuAlolanRaichuGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TAG_TEAM];
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 260;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.METAL, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Tandem Shock',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'If this Pokémon was on the Bench and became your Active Pokémon this turn,'
                    + ' this attack does 80 more damage, and your opponent\'s Active Pokémon is now Paralyzed.'
            },
            {
                name: 'Lightning Ride GX',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 150,
                text: ' Switch this Pokémon with 1 of your Benched Pokémon. If this Pokémon has at least 2 extra [L] Energy attached to it (in addition to this attack\'s cost), this attack does 100 more damage.'
                    + '  (You can\'t use more than 1 GX attack in a game.) '
            }];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '195';
        this.name = 'Raichu & Alolan RaichuGX GX';
        this.fullName = 'Raichu & Alolan Raichu GX UNM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            if (this.movedToActiveThisTurn) {
                effect.damage += 80;
                const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                store.reduceEffect(state, specialConditionEffect);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.usedGX === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            player.usedGX = true;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let LightningEnergyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                LightningEnergyCount += em.provides.filter(cardType => {
                    return cardType === card_types_1.CardType.LIGHTNING;
                }).length;
            });
            if (LightningEnergyCount - 2 >= 2 && checkProvidedEnergyEffect.energyMap.length >= 5) {
                effect.damage += 100;
            }
            return state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), selected => {
                if (!selected || selected.length === 0) {
                    return state;
                }
                const target = selected[0];
                player.switchPokemon(target);
            });
        }
        return state;
    }
}
exports.RaichuAlolanRaichuGX = RaichuAlolanRaichuGX;
