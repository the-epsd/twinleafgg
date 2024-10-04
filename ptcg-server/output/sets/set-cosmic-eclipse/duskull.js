"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duskull = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Duskull extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 40;
        this.weakness = [{ type: game_1.CardType.DARK }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Spiritborne Evolution',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may discard 3 cards from your hand. If you do, search your deck for a card that evolves from this Pokémon and put it onto this Pokémon to evolve it. Then, shuffle your deck.'
            }];
        this.attacks = [
            {
                name: 'Ominous Eyes',
                cost: [game_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Put 2 damage counters on 1 of your opponent\'s Pokémon.'
            }
        ];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.name = 'Duskull';
        this.fullName = 'Duskull CEC';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.hand.cards.length < 3) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: 3, max: 3 }), cards => {
                cards = cards || [];
                player.hand.moveCardsTo(cards, player.discard);
                cards.forEach((card, index) => {
                    store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
                });
                // Blocking pokemon cards, that cannot be valid evolutions
                const blocked = [];
                player.deck.cards.forEach((card, index) => {
                    if (card instanceof game_1.PokemonCard && card.evolvesFrom !== 'Duskull') {
                        blocked.push(index);
                    }
                });
                let selectedCards = [];
                store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: game_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: true, blocked }), selected => {
                    selectedCards = selected || [];
                    if (selectedCards.length === 0) {
                        return state;
                    }
                    const evolution = selectedCards[0];
                    const blocked2 = [];
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                        if (card.name !== 'Duskull') {
                            blocked2.push(target);
                        }
                    });
                    let targets = [];
                    store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_EVOLVE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked: blocked2 }), selection => {
                        targets = selection || [];
                        // Evolve Pokemon
                        player.deck.moveCardTo(evolution, targets[0]);
                        targets[0].clearEffects();
                        targets[0].pokemonPlayedTurn = state.turn;
                        return state;
                    });
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
                return state;
            });
        }
        return state;
    }
}
exports.Duskull = Duskull;
