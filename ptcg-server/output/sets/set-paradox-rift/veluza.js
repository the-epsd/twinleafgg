"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Veluza = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Veluza extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Filet Memento',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is in the Active Spot and is Knocked Out by damage from an attack from your opponent\'s Pokémon, move up to 2 [W] Energy cards from this Pokémon to 1 of your Benched Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Hydro Pump',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                damageCalculation: '+',
                text: 'This attack does 20 more damage times the amount of [W] Energy attached to this Pokémon.'
            }
        ];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '54';
        this.name = 'Veluza';
        this.fullName = 'Veluza PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this) &&
            effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
            const player = effect.player;
            try {
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
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 2, validCardTypes: [card_types_1.CardType.WATER, card_types_1.CardType.ANY, card_types_1.CardType.WLFM, card_types_1.CardType.GRW] }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.active.moveCardTo(transfer.card, target);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => cardType === card_types_1.CardType.WATER || cardType === card_types_1.CardType.ANY || cardType == card_types_1.CardType.WLFM || cardType == card_types_1.CardType.GRW).length;
            });
            effect.damage += energyCount * 20;
        }
        return state;
    }
}
exports.Veluza = Veluza;
