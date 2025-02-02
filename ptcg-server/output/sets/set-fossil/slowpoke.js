"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slowpoke = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Slowpoke extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Spacing Out',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, remove a damage counter from Slowpoke. This attack can\'t be used if Slowpoke has no damage counters on it.'
            },
            {
                name: 'Scavenge',
                cost: [P, P],
                damage: 0,
                text: 'Discard 1 {P} Energy card attached to Slowpoke in order to use this attack. Put a Trainer card from your discard pile into your hand.'
            }];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Slowpoke';
        this.fullName = 'Slowpoke FO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const target = player.active;
            if (target.damage === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            else {
                const healEffect = new game_effects_1.HealEffect(player, target, 10);
                state = store.reduceEffect(state, healEffect);
                return state;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.PSYCHIC], { allowCancel: true }), energy => {
                const cards = (energy || []).map(e => e.card);
                if (cards.length > 0) {
                    const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                    discardEnergy.target = player.active;
                    return store.reduceEffect(state, discardEnergy);
                }
            });
            const hasTrainer = player.discard.cards.some(c => {
                return c instanceof game_1.TrainerCard;
            });
            if (!hasTrainer) {
                return state;
            }
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 1, max: 1, allowCancel: true }), selected => {
                cards = selected || [];
                cards.forEach((card, index) => {
                    store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                });
                if (cards.length > 0) {
                    return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
                }
                if (cards.length > 0) {
                    player.discard.moveCardsTo(cards, player.hand);
                }
            });
        }
        return state;
    }
}
exports.Slowpoke = Slowpoke;
