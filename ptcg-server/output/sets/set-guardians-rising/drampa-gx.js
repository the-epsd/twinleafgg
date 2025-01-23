"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrampaGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const game_3 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
function* useWhirlpool(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    // Defending Pokemon has no energy cards attached
    if (!opponent.active.cards.some(c => c instanceof game_1.EnergyCard)) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL }, { min: 1, max: 1, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
    return store.reduceEffect(state, discardEnergy);
}
class DrampaGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Righteous Edge',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Discard a Special Energy from your opponent\'s Active Pokémon.'
            },
            {
                name: 'Berserk',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'If your Benched Pokémon have any damage counters on them, this attack does 70 more damage.'
            },
            {
                name: 'Big Wheel-GX',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Shuffle your hand into your deck. Then, draw 10 cards. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'GRI';
        this.setNumber = '115';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Drampa-GX';
        this.fullName = 'Drampa-GX GRI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useWhirlpool(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // checking if this pokemon is in play
            let isThereDamage = false;
            player.forEachPokemon(game_3.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (cardList === player.active) {
                    return;
                }
                if (cardList.damage > 0) {
                    isThereDamage = true;
                }
            });
            if (isThereDamage) {
                effect.damage += 70;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const player = effect.player;
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_message_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            if (player.hand.cards.length > 0) {
                player.hand.moveCardsTo(player.hand.cards, player.deck);
                return store.prompt(state, new game_2.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                    while (player.hand.cards.length < 10) {
                        if (player.deck.cards.length === 0) {
                            break;
                        }
                        player.deck.moveTo(player.hand, 1);
                    }
                });
            }
        }
        return state;
    }
}
exports.DrampaGX = DrampaGX;
