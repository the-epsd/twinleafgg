"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadiantJirachi = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
class RadiantJirachi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.RADIANT];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Entrusted Wishes',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'If this Pokémon is in the Active Spot and is Knocked Out by damage from an attack from your opponent\'s Pokémon, search your deck for up to 3 cards and put them into your hand. Then, shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Astral Misfortune',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Flip 2 coins. If both of them are heads, your opponent\'s Active Pokémon is Knocked Out.'
            }];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '120';
        this.name = 'Radiant Jirachi';
        this.fullName = 'Radiant Jirachi SIT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
            // This Pokemon was knocked out
            const player = effect.player;
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 3, allowCancel: false }), (selected) => {
                cards = selected || [];
                if (cards.length > 0) {
                    player.deck.moveCardsTo(cards, player.hand);
                }
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), (order) => {
                    player.deck.applyOrder(order);
                    return state;
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let coin1Result = false;
            let coin2Result = false;
            return store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), (result) => {
                coin1Result = result;
                return store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), (result) => {
                    coin2Result = result;
                    if (coin1Result && coin2Result) {
                        // Both heads
                        opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => {
                            if (cardList.getPokemonCard() === opponent.active.cards[0]) {
                                cardList.damage += 999;
                            }
                        });
                    }
                });
            });
        }
        return state;
    }
}
exports.RadiantJirachi = RadiantJirachi;
