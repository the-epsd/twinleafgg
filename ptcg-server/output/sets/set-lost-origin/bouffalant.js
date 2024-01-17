"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bouffalant = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Bouffalant extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Lost Headbutt',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'Put an Energy attached to your opponent\'s Active Pokémon in the Lost Zone.'
            },
            {
                name: 'Superpowered Horns',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: ''
            }
        ];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '148';
        this.name = 'Bouffalant';
        this.fullName = 'Bouffalant LOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (!opponent.active.cards.some(c => c instanceof game_1.EnergyCard)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const energyToDiscard = new game_1.CardList();
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS], { allowCancel: false }), (energy) => {
                const cards = (energy || []).map(e => e.card);
                // Fix error by looping through cards and moving individually
                cards.forEach(card => {
                    energyToDiscard.moveCardTo(card, opponent.lostzone);
                });
                return state;
            });
        }
        return state;
    }
}
exports.Bouffalant = Bouffalant;
