"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tinkaton = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Tinkaton extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Tinkatuff';
        this.powers = [{
                name: 'Gather Materials',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'You must discard a card from your hand in order to use this Ability. Once during your turn, you may draw 3 cards.'
            }];
        this.attacks = [{
                name: 'Special Hammer',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 90,
                damageCalculation: '+',
                text: 'If this Pokemon has any Special Energy attached, this attack does 90 more damage.'
            }];
        this.regulationMark = 'G';
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '105';
        this.name = 'Tinkaton';
        this.fullName = 'Tinkaton PAL';
        this.GATHER_MATERIALS_MARKER = 'GATHER_MATERIALS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.GATHER_MATERIALS_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.hand.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.GATHER_MATERIALS_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: true, min: 1, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                player.marker.addMarker(this.GATHER_MATERIALS_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                player.hand.moveCardsTo(cards, player.discard);
                player.deck.moveTo(player.hand, 3);
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack == this.attacks[0]) {
            const player = effect.player;
            const pokemon = player.active;
            let specialEnergyCount = 0;
            pokemon.cards.forEach(c => {
                if (c instanceof game_1.EnergyCard) {
                    if (c.energyType === card_types_1.EnergyType.SPECIAL) {
                        specialEnergyCount++;
                    }
                }
            });
            if (specialEnergyCount > 0) {
                effect.damage += 90;
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.GATHER_MATERIALS_MARKER, this);
        }
        return state;
    }
}
exports.Tinkaton = Tinkaton;
