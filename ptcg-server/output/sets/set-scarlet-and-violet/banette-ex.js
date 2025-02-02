"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Banetteex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Banetteex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Shuppet';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 250;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Everlasting Darkness',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 30,
                text: 'During your opponent\'s next turn, they can\'t play any Item cards from their hand.',
            },
            {
                name: 'Poltergeist',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 60,
                damageCalculation: 'x',
                text: 'Your opponent reveals their hand. This attack does 60 damage for each Trainer card you find there.',
            },
        ];
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.name = 'Banette ex';
        this.fullName = 'Banette ex SVI';
        this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.marker.addMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            state = store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, opponent.hand.cards), () => {
                const cardsInOpponentHand = opponent.hand.cards.filter(card => card instanceof game_1.TrainerCard).length;
                const damage = opponent.hand.cards.slice(0, cardsInOpponentHand);
                effect.damage = damage.length * 60;
            });
        }
        if (effect instanceof play_card_effects_1.PlayItemEffect) {
            const player = effect.player;
            if (player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
        }
        return state;
    }
}
exports.Banetteex = Banetteex;
