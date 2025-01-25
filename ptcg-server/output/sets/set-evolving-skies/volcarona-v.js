"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolcaronaV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class VolcaronaV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.cardType = R;
        this.hp = 210;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Surging Flames',
                cost: [R],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 20 more damage for each basic Energy card in your discard pile. Then, shuffle those Energy cards into your deck.'
            },
            {
                name: 'Fire Blast',
                cost: [R, R, C],
                damage: 160,
                text: 'Discard an Energy from this Pokémon.'
            }];
        this.set = 'EVS';
        this.name = 'Volcarona V';
        this.fullName = 'Volcarona V EVS';
        this.setNumber = '21';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Surging Flames
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // counting the energies
            const energiesInDiscard = player.discard.cards.filter(c => c instanceof game_1.EnergyCard && c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC).length;
            if (energiesInDiscard === 0) {
                return state;
            }
            effect.damage += 20 * energiesInDiscard;
            // slapping those energies back into the deck
            player.discard.cards.forEach(c => {
                if (c instanceof game_1.EnergyCard && c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC) {
                    player.discard.moveCardTo(c, player.deck);
                }
            });
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        }
        // Fire Blast
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (!player.active.cards.some(c => c instanceof game_1.EnergyCard)) {
                return state;
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
        }
        return state;
    }
}
exports.VolcaronaV = VolcaronaV;
