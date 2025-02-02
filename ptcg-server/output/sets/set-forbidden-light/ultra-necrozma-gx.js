"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UltraNecrozmaGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
// FLI Ultra Necrozma-GX 95 (https://limitlesstcg.com/cards/FLI/95)
class UltraNecrozmaGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX, card_types_1.CardTag.ULTRA_BEAST];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.FAIRY }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Photon Geyser',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.METAL],
                damage: 20,
                text: 'Discard all basic [P] Energy from this Pokémon. This attack does 80 more damage for each card you discarded in this way.'
            },
            {
                name: 'Sky-Scorching Light-GX',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.METAL],
                damage: 0,
                gxAttack: true,
                text: 'You can use this attack only if the total of both players\' remaining Prize cards is 6 or less. Put 6 damage counters on each of your opponent\'s Pokémon. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'FLI';
        this.name = 'Ultra Necrozma-GX';
        this.fullName = 'Ultra Necrozma-GX FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
    }
    reduceEffect(store, state, effect) {
        // Photon Geyser
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const psychicEnergy = player.active.cards.filter(card => card instanceof game_1.EnergyCard && card.name === 'Psychic Energy');
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, psychicEnergy);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
            const damageAmount = psychicEnergy.length * 80;
            const damageEffect = new attack_effects_1.PutDamageEffect(effect, damageAmount);
            damageEffect.target = opponent.active;
            store.reduceEffect(state, damageEffect);
        }
        // Sky Scorching Light-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.getPrizeLeft() + opponent.getPrizeLeft() > 6) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                const damageEffect = new attack_effects_1.PutCountersEffect(effect, 60);
                damageEffect.target = cardList;
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.UltraNecrozmaGX = UltraNecrozmaGX;
