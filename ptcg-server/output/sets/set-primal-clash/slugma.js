"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slugma = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Slugma extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Grass Fire',
                cost: [card_types_1.CardType.FIRE],
                damage: 0,
                text: ' Discard a [G] Energy attached to your opponent\'s Active Pokémon.'
            },
            {
                name: 'Ram',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }];
        this.set = 'PRC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.name = 'Slugma';
        this.fullName = 'Slugma PRC';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (!opponent.active.cards.some(c => c instanceof game_1.EnergyCard && c.provides.includes(card_types_1.CardType.GRASS)) &&
                !opponent.active.cards.some(c => c instanceof game_1.EnergyCard && c.provides.includes(card_types_1.CardType.ANY))) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, opponent.active);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.GRASS, card_types_1.CardType.ANY], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = opponent.active;
                return store.reduceEffect(state, discardEnergy);
            });
        }
        return state;
    }
}
exports.Slugma = Slugma;
