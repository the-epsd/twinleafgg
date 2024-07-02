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
        this.setNumber = '080';
        this.name = 'Galarian Zapdos V';
        this.fullName = 'Galarian Zapdos V CRE';
    }
    // Implement ability
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let fightingInstinctCount = 0;
            // Check opponent's active Pokemon
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && (opponentActive.tags.includes(card_types_2.CardTag.POKEMON_V) ||
                opponentActive.tags.includes(card_types_2.CardTag.POKEMON_VMAX) ||
                opponentActive.tags.includes(card_types_2.CardTag.POKEMON_VSTAR))) {
                fightingInstinctCount += 1;
            }
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
            // Check opponent's benched Pokemon
            opponent.bench.forEach(cardList => {
                cardList.cards.forEach(card => {
                    if (card instanceof pokemon_card_1.PokemonCard &&
                        (card.tags.includes(card_types_2.CardTag.POKEMON_V) ||
                            card.tags.includes(card_types_2.CardTag.POKEMON_VMAX) ||
                            card.tags.includes(card_types_2.CardTag.POKEMON_VSTAR))) {
                        fightingInstinctCount += 1;
                    }
                });
            });
            // Reduce attack cost by removing 1 Colorless energy for each counted Pokemon
            const attackCost = this.attacks[0].cost;
            const colorlessToRemove = fightingInstinctCount;
            this.attacks[0].cost = attackCost.filter(c => c !== card_types_1.CardType.COLORLESS).slice(0, -colorlessToRemove);
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
                    store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, oppActive, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL }, { min: 1, max: 1, allowCancel: false }), selected => {
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
