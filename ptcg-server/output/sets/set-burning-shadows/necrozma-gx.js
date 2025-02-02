"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NecrozmaGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
// BUS Necrozma-GX 63 (https://limitlesstcg.com/cards/BUS/63)
class NecrozmaGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Light\'s End',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'Prevent all damage done to this Pokémon by attacks from [C] Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Prismatic Burst',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'Discard all basic [P] Energy from this Pokémon. This attack does 60 more damage for each card you discarded in this way.'
            },
            {
                name: 'Black Ray-GX',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                gxAttack: true,
                text: 'This attack does 100 damage to each of your opponent\'s Pokémon-GX and Pokémon-EX. This damage isn\'t affected by Weakness or Resistance. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'BUS';
        this.name = 'Necrozma-GX';
        this.fullName = 'Necrozma-GX BUS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
    }
    reduceEffect(store, state, effect) {
        // Light's End
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            // It's not this pokemon card
            if (pokemonCard !== this) {
                return state;
            }
            // It's not an attack or a Pokemon that isn't colorless attacks
            if (state.phase !== game_1.GamePhase.ATTACK || pokemonCard.cardType !== card_types_1.CardType.COLORLESS) {
                return state;
            }
            const player = game_1.StateUtils.findOwner(state, effect.target);
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            effect.preventDefault = true;
        }
        // Prismatic Burst
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const psychicEnergy = player.active.cards.filter(card => card instanceof game_1.EnergyCard && card.name === 'Psychic Energy');
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, psychicEnergy);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
            const damageAmount = psychicEnergy.length * 60;
            const damageEffect = new attack_effects_1.PutDamageEffect(effect, damageAmount);
            damageEffect.target = opponent.active;
            store.reduceEffect(state, damageEffect);
        }
        // Black Ray-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card.tags.includes(card_types_1.CardTag.POKEMON_GX) || card.tags.includes(card_types_1.CardTag.POKEMON_EX)) {
                    if (cardList === opponent.active) {
                        return;
                    }
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 100);
                    damageEffect.target = cardList;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.NecrozmaGX = NecrozmaGX;
