"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianZoroark = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class HisuianZoroark extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Hisuian Zorua';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Doom Curse',
                cost: [],
                damage: 0,
                text: 'At the end of your opponent\'s next turn, the Defending Pokémon will be Knocked Out.'
            },
            {
                name: 'Call Back',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Put a card from your discard pile into your hand.'
            }
        ];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.name = 'Hisuian Zoroark';
        this.fullName = 'Hisuian Zoroark LOR';
        this.KNOCKOUT_MARKER = 'KNOCKOUT_MARKER';
        this.CLEAR_KNOCKOUT_MARKER = 'CLEAR_KNOCKOUT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            effect.player.marker.addMarker(this.KNOCKOUT_MARKER, this);
            opponent.active.marker.addMarker(this.CLEAR_KNOCKOUT_MARKER, this);
            console.log('first marker added');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(this.CLEAR_KNOCKOUT_MARKER, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            effect.player.active.damage = 999;
            effect.player.active.marker.removeMarker(this.CLEAR_KNOCKOUT_MARKER, this);
            opponent.marker.removeMarker(this.KNOCKOUT_MARKER, this);
            console.log('clear marker added');
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const hasCardInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.Card;
            });
            if (!hasCardInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            return store.prompt(state, [
                new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 1, max: 1, allowCancel: false })
            ], selected => {
                const cards = selected || [];
                player.discard.moveCardsTo(cards, player.hand);
            });
        }
        return state;
    }
}
exports.HisuianZoroark = HisuianZoroark;
