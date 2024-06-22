"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlolanRaticate = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class AlolanRaticate extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'AlolanRattata';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Chase Up',
                cost: [card_types_1.CardType.DARK],
                damage: 0,
                text: 'Search your deck for a card and put it into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Super Fang',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put damage counters on your opponent\'s Active Pokémon until its remaining HP is 10. '
            }];
        this.set = 'PGO';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
        this.name = 'AlolanRaticate';
        this.fullName = 'AlolanRaticate PGO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 1, allowCancel: false }), cards => {
                player.deck.moveCardsTo(cards, player.hand);
                state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
                return state;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const selectedTarget = opponent.active;
            const selectedPokemonCard = selectedTarget.getPokemonCard();
            const hp = selectedPokemonCard === null || selectedPokemonCard === void 0 ? void 0 : selectedPokemonCard.hp;
            const remainingHp = hp ? hp - 10 : 0;
            console.log('Pokemon\'s remaining hp: ' + remainingHp);
            const damageEffect = new attack_effects_1.PutDamageEffect(effect, remainingHp);
            damageEffect.target = selectedTarget;
            store.reduceEffect(state, damageEffect);
        }
        return state;
    }
}
exports.AlolanRaticate = AlolanRaticate;
