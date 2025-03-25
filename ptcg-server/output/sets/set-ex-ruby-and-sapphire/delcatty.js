"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delcatty = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Delcatty extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Skitty';
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Energy Draw',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may discard 1 Energy card from your hand. Then draw up to 3 cards from your deck. This power can\’t be used if Delcatty is affected by a Special Condition.'
            }];
        this.attacks = [
            {
                name: 'Max Energy Source',
                cost: [C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Does 10 damage times the amount of Energy attached to all of your Active Pokémon.'
            }
        ];
        this.set = 'RS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Delcatty';
        this.fullName = 'Delcatty RS';
        this.ENERGY_DRAW_MARKER = 'ENERGY_DRAW_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Energy Draw
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof energy_card_1.EnergyCard;
            });
            // Check if there is an energy in hand
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            // One per turn only
            if (prefabs_1.HAS_MARKER(this.ENERGY_DRAW_MARKER, player, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            // Cannot use if affected by special conditions
            if (player.active.cards[0] === this && player.active.specialConditions.length > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, min: 1, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                player.hand.moveCardsTo(cards, player.discard);
                player.deck.moveTo(player.hand, 3);
            });
            prefabs_1.ADD_MARKER(this.ENERGY_DRAW_MARKER, player, this);
            prefabs_1.ABILITY_USED(player, this);
            return state;
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            prefabs_1.REMOVE_MARKER(this.ENERGY_DRAW_MARKER, player, this);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.getPokemonCard() === this) {
                    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                    store.reduceEffect(state, checkProvidedEnergy);
                    const blockedCards = [];
                    checkProvidedEnergy.energyMap.forEach(em => {
                        if (!em.provides.includes(card_types_1.CardType.ANY)) {
                            blockedCards.push(em.card);
                        }
                    });
                    const damagePerEnergy = 10;
                    effect.damage = checkProvidedEnergy.energyMap.length * damagePerEnergy;
                }
            });
            return state;
        }
        //Marker remover
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if (prefabs_1.HAS_MARKER(this.ENERGY_DRAW_MARKER, effect.player, this)) {
                prefabs_1.REMOVE_MARKER(this.ENERGY_DRAW_MARKER, effect.player, this);
            }
        }
        return state;
    }
}
exports.Delcatty = Delcatty;
