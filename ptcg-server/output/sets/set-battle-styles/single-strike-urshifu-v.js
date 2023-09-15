"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleStrikeUrshifuV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class SingleStrikeUrshifuV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V, card_types_1.CardTag.SINGLE_STRIKE];
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 220;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Laser Focus',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for up to 2 F Energy cards and attach ' +
                    'them to this Pokémon. Then, shuffle your deck.'
            },
            {
                name: 'Impact Blow',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 180,
                text: 'During your next turn, this Pokémon can\'t use ' +
                    'Impact Blow.'
            }
        ];
        this.set = 'BST';
        this.name = 'Single Strike Urshifu V';
        this.fullName = 'Single Strike Urshifu V BST 085';
        this.WITHDRAW_MARKER = 'WITHDRAW_MARKER';
        this.CLEAR_WITHDRAW_MARKER = 'CLEAR_WITHDRAW_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList === undefined) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fighting Energy' }, { min: 0, max: 2, allowCancel: true }), cards => {
                cards = cards || [];
                if (cards.length > 0) {
                    player.deck.moveCardsTo(cards, cardList);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.active.marker.addMarker(this.WITHDRAW_MARKER, this);
            if (effect instanceof game_effects_1.AttackEffect
                && player.active.marker.hasMarker(this.WITHDRAW_MARKER)) {
                effect.preventDefault = true;
                return state;
            }
            if (effect instanceof game_phase_effects_1.EndTurnEffect
                && effect.player.marker.hasMarker(this.CLEAR_WITHDRAW_MARKER, this)) {
                effect.player.marker.removeMarker(this.CLEAR_WITHDRAW_MARKER, this);
                effect.player.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                    cardList.marker.removeMarker(this.WITHDRAW_MARKER, this);
                });
            }
        }
        return state;
    }
}
exports.SingleStrikeUrshifuV = SingleStrikeUrshifuV;
