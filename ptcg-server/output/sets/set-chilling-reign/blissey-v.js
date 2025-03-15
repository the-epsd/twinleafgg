"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlisseyV = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class BlisseyV extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_V];
        this.cardType = game_1.CardType.COLORLESS;
        this.hp = 250;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Natural Cure',
                powerType: game_1.PowerType.ABILITY,
                text: 'Whenever you attach an Energy card from your hand to this Pokémon, it recovers from all Special Conditions.'
            }];
        this.attacks = [{
                name: 'Blissful Blast',
                cost: [game_1.CardType.COLORLESS],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each Energy attached to this Pokémon. If you did any damage with this attack, you may attach up to 3 Energy cards from your discard pile to this Pokémon.'
            }];
        this.set = 'CRE';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '119';
        this.name = 'Blissey V';
        this.fullName = 'Blissey V CRE';
        this.usedBlissfulBlast = false;
    }
    reduceEffect(store, state, effect) {
        // if (effect instanceof AttachEnergyEffect && effect.target.cards.includes(this)) {
        //   const player = effect.player;
        //   const pokemonCard = effect.target.getPokemonCard();
        //   if (pokemonCard !== this) {
        //     return state;
        //   }
        //   // Try to reduce PowerEffect, to check if something is blocking our ability
        //   try {
        //     const stub = new PowerEffect(player, {
        //       name: 'test',
        //       powerType: PowerType.ABILITY,
        //       text: ''
        //     }, this);
        //     store.reduceEffect(state, stub);
        //   } catch {
        //     return state;
        //   }
        //   // Heal conditions
        //   effect.target.specialConditions = [];
        //   return state;
        // }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let energies = 0;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            checkProvidedEnergyEffect.energyMap.forEach(energy => {
                energies += energy.provides.length;
            });
            effect.damage = 10 + (30 * energies);
            //const energies = player.active.cards.filter(card => card instanceof EnergyCard);
            this.usedBlissfulBlast = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedBlissfulBlast === true) {
            const player = effect.player;
            const energyCards = player.discard.cards.filter(c => c.superType === game_1.SuperType.ENERGY);
            const maxEnergyCards = Math.min(3, energyCards.length);
            if (energyCards.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: maxEnergyCards }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
                this.usedBlissfulBlast = false;
            });
        }
        return state;
    }
}
exports.BlisseyV = BlisseyV;
