"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chimecho = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Chimecho extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 70;
        this.weakness = [{ type: game_1.CardType.DARK }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Auspicious Tone',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for a Pokémon and a Supporter card, reveal them, and put them into your hand. Then, shuffle your deck.'
            }, {
                name: 'Hypnoblast',
                cost: [game_1.CardType.PSYCHIC, game_1.CardType.COLORLESS],
                damage: 30,
                text: 'Your opponent\'s Active Pokémon is now Asleep.'
            }];
        this.set = 'VIV';
        this.name = 'Chimecho';
        this.fullName = 'Chimecho VIV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '72';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [game_1.SpecialCondition.ASLEEP]);
            store.reduceEffect(state, specialConditionEffect);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let supporters = 0;
            let pokemon = 0;
            const blocked = [];
            player.deck.cards.forEach((c, index) => {
                if (c instanceof game_1.TrainerCard && c.trainerType === game_1.TrainerType.SUPPORTER) {
                    supporters += 1;
                }
                else if (c instanceof game_1.PokemonCard) {
                    pokemon += 1;
                }
                else {
                    blocked.push(index);
                }
            });
            const maxSupporters = Math.min(supporters, 1);
            const maxPokemons = Math.min(pokemon, 1);
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: maxSupporters + maxPokemons, allowCancel: false, maxSupporters, maxPokemons }), selected => {
                cards = selected || [];
                cards.forEach((card, index) => {
                    player.deck.moveCardTo(card, player.hand);
                    store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                });
                state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Chimecho = Chimecho;
