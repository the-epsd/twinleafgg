"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lickilicky = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Lickilicky extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Lickitung';
        this.attacks = [{
                name: 'Rollout',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 40,
                text: ''
            },
            {
                name: 'Licks Go Crazy',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: 'Discard a random card from your opponent\'s hand, discard the top card of your opponent\'s deck, and discard an Energy from your opponent\'s Active Pokémon.'
            }];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '162';
        this.name = 'Lickilicky';
        this.fullName = 'Lickilicky UNM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length > 0) {
                const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                const randomCard = opponent.hand.cards[randomIndex];
                opponent.hand.moveCardTo(randomCard, opponent.discard);
            }
            opponent.deck.moveTo(opponent.discard, 1);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, opponent.active);
            state = store.reduceEffect(state, checkProvidedEnergy);
            if (checkProvidedEnergy.energyMap.length === 0) {
                return state;
            }
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = opponent.active;
                return store.reduceEffect(state, discardEnergy);
            });
            return state;
        }
        return state;
    }
}
exports.Lickilicky = Lickilicky;
