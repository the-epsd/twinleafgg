"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sableye = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Sableye extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 60;
        this.resistance = [{
                type: card_types_1.CardType.COLORLESS,
                value: -20
            }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Overeager',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'If Sableye is your Active Pokemon at the beginning of the game, ' +
                    'you go first. (If each player\'s Active Pokemon has the Overreager ' +
                    'Poke-Body, this power does nothing.)'
            }];
        this.attacks = [
            {
                name: 'Impersonate',
                cost: [],
                damage: 0,
                text: 'Search your deck for a Supporter card and discard it. ' +
                    'Shuffle your deck afterward. ' +
                    'Then, use the effect of that card as the effect of this attack.'
            },
            {
                name: 'Overconfident',
                cost: [card_types_1.CardType.DARK],
                damage: 10,
                text: 'If the Defending Pokemon has fewer remaining HP than Sableye, ' +
                    'this attack\'s base damage is 40.'
            }
        ];
        this.set = 'SF';
        this.name = 'Sableye';
        this.fullName = 'Sableye SF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
    }
    reduceEffect(store, state, effect) {
        // Overeager
        if (effect instanceof game_phase_effects_1.WhoBeginsEffect) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            const player = game_1.StateUtils.findOwner(state, cardList);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentCard = opponent.active.getPokemonCard();
            if (opponentCard && opponentCard.powers.some(p => p.name === 'Overeager')) {
                return state;
            }
            if (cardList === player.active) {
                store.log(state, game_message_1.GameLog.LOG_STARTS_BECAUSE_OF_ABILITY, {
                    name: player.name,
                    ability: this.powers[0].name
                });
                effect.player = player;
            }
            return state;
        }
        // Impersonate
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_COPY_EFFECT, player.deck, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 1, max: 1, allowCancel: true }), (cards) => {
                if (!cards || cards.length === 0) {
                    return;
                }
                const trainerCard = cards[0];
                const deckIndex = player.deck.cards.indexOf(trainerCard);
                player.deck.moveCardTo(trainerCard, player.hand);
                try {
                    const playTrainer = new play_card_effects_1.TrainerEffect(player, trainerCard);
                    store.reduceEffect(state, playTrainer);
                }
                catch (error) {
                    player.hand.cards.pop();
                    player.deck.cards.splice(deckIndex, 0, trainerCard);
                    throw error;
                }
            });
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        }
        // Overconfident
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const sourceHp = new check_effects_1.CheckHpEffect(player, effect.source);
            store.reduceEffect(state, sourceHp);
            const targetHp = new check_effects_1.CheckHpEffect(opponent, effect.target);
            store.reduceEffect(state, targetHp);
            const sourceHpLeft = sourceHp.hp - effect.source.damage;
            const targetHpLeft = targetHp.hp - effect.target.damage;
            if (sourceHpLeft > targetHpLeft) {
                effect.damage = 40;
            }
        }
        return state;
    }
}
exports.Sableye = Sableye;
