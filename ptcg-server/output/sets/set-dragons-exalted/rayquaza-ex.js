"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RayquazaEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const check_effects_1 = require("../../game/store/effects/check-effects");
const select_prompt_1 = require("../../game/store/prompts/select-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class RayquazaEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 170;
        this.weakness = [{ type: card_types_1.CardType.DRAGON }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Celestial Roar',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Discard the top 3 cards of your deck. If any of those cards ' +
                    'are Energy cards, attach them to this Pokemon.'
            },
            {
                name: 'Dragon Burst',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.LIGHTNING],
                damage: 60,
                text: 'Discard all basic R Energy or all basic L Energy attached to ' +
                    'this Pokemon. This attack does 60 damage times the number of Energy ' +
                    'cards you discarded.'
            }
        ];
        this.set = 'DRX';
        this.name = 'Rayquaza EX';
        this.fullName = 'Rayquaza EX DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const temp = new game_1.CardList();
            player.deck.moveTo(temp, 3);
            const energyCards = temp.cards.filter(c => c instanceof game_1.EnergyCard);
            temp.moveCardsTo(energyCards, player.active);
            temp.moveTo(player.discard);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            return store.prompt(state, new select_prompt_1.SelectPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, [game_message_1.GameMessage.ALL_FIRE_ENERGIES, game_message_1.GameMessage.ALL_LIGHTNING_ENERGIES], { allowCancel: false }), choice => {
                const cardType = choice === 0 ? card_types_1.CardType.FIRE : card_types_1.CardType.LIGHTNING;
                let damage = 0;
                const cards = [];
                for (const energyMap of checkProvidedEnergy.energyMap) {
                    const energy = energyMap.provides.filter(t => t === cardType || t === card_types_1.CardType.ANY);
                    if (energy.length > 0) {
                        cards.push(energyMap.card);
                        damage += 60 * energy.length;
                    }
                }
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
                effect.damage = damage;
            });
        }
        return state;
    }
}
exports.RayquazaEx = RayquazaEx;
