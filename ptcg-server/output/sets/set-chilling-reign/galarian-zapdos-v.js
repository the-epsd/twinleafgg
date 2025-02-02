"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalarianZapdosV = void 0;
/* eslint-disable indent */
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const card_types_2 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class GalarianZapdosV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_2.CardTag.POKEMON_V];
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Fighting Instinct',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon\'s attacks cost [C] less for each of your opponent\'s Pokémon V in play.'
            }];
        this.attacks = [
            {
                name: 'Thunderous Kick',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 170,
                text: 'Before doing damage, discard a Special Energy from your opponent\'s Active Pokémon.'
            }
        ];
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
        this.name = 'Galarian Zapdos V';
        this.fullName = 'Galarian Zapdos V CRE';
    }
    // Implement ability
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect &&
            (effect.attack === this.attacks[0] ||
                this.tools.some(tool => tool.attacks && tool.attacks.includes(effect.attack)))) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Count V, VSTAR, and VMAX Pokémon in play for the opponent
            const countSpecialPokemon = (player) => {
                const specialTags = [card_types_2.CardTag.POKEMON_V, card_types_2.CardTag.POKEMON_VSTAR, card_types_2.CardTag.POKEMON_VMAX];
                let count = 0;
                // Check active Pokémon
                const activePokemon = player.active.getPokemonCard();
                if (activePokemon && specialTags.some(tag => activePokemon.tags.includes(tag))) {
                    count++;
                }
                // Check bench Pokémon
                player.bench.forEach(slot => {
                    const benchPokemon = slot.getPokemonCard();
                    if (benchPokemon && specialTags.some(tag => benchPokemon.tags.includes(tag))) {
                        count++;
                    }
                });
                return count;
            };
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                console.log(effect.cost);
                return state;
            }
            const specialPokemonCount = countSpecialPokemon(opponent);
            // Determine Colorless energy reduction based on special Pokémon count
            const colorlessToRemove = Math.min(specialPokemonCount, 4);
            // Remove Colorless energy from attack cost
            for (let i = 0; i < colorlessToRemove; i++) {
                const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                if (index !== -1) {
                    effect.cost.splice(index, 1);
                }
            }
            console.log(effect.cost);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const oppActive = opponent.active;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, oppActive);
            store.reduceEffect(state, checkEnergy);
            checkEnergy.energyMap.forEach(em => {
                const energyCard = em.card;
                if (energyCard instanceof game_1.EnergyCard && energyCard.energyType === card_types_1.EnergyType.SPECIAL) {
                    let cards = [];
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, oppActive, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL }, { min: 1, max: 1, allowCancel: false }), selected => {
                        cards = selected;
                    });
                    oppActive.moveCardsTo(cards, opponent.discard);
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                    damageEffect.target = opponent.active;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.GalarianZapdosV = GalarianZapdosV;
