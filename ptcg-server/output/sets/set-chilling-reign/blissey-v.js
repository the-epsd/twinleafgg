"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlisseyV = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
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
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Whenever you attach an Energy card from your hand to this Pokémon, it recovers from all Special Conditions.'
            }];
        this.attacks = [{
                name: 'Blissful Blast',
                cost: [game_1.CardType.COLORLESS],
                damage: 10,
                text: 'This attack does 30 more damage for each Energy attached to this Pokémon. If you did any damage with this attack, you may attach up to 3 Energy cards from your discard pile to this Pokémon.'
            }];
        this.set = 'CRE';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '119';
        this.name = 'Blissey V';
        this.fullName = 'Blissey V CRE';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const pokemonCard = effect.target.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
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
            if (effect instanceof attack_effects_1.RemoveSpecialConditionsEffect && effect.target.cards.includes(this)) {
                // Heal conditions
                effect.target.specialConditions = [];
                return state;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const pokemonCard = effect.target.getPokemonCard();
            const checkProvidedEnergyEffect2 = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect2);
            const energyCount2 = checkProvidedEnergyEffect2.energyMap.reduce((left, p) => left + p.provides.length, 0);
            effect.damage += energyCount2 * 30;
            if (pokemonCard !== this) {
                return state;
            }
            const energyCards = player.discard.cards.filter(c => c.superType === game_1.SuperType.ENERGY);
            const maxEnergyCards = Math.min(3, energyCards.length);
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: maxEnergyCards }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.active.moveCardTo(transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.BlisseyV = BlisseyV;
