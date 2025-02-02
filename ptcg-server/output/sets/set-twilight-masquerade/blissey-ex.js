"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blisseyex = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Blisseyex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Chansey';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.hp = 310;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Happy Switch',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may move a Basic Energy from 1 of your Pokémon to another of your Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Return',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 180,
                text: 'You may draw until you have 6 cards in hand.'
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '134';
        this.name = 'Blissey ex';
        this.fullName = 'Blissey ex TWM';
        this.BLISSFUL_SWAP_MARKER = 'BLISSFUL_SWAP_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.BLISSFUL_SWAP_MARKER, this);
            return state;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.BLISSFUL_SWAP_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            let hasBasicEnergy = false;
            let pokemonCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                pokemonCount += 1;
                const basicEnergyAttached = cardList.cards.some(c => {
                    return c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC;
                });
                hasBasicEnergy = hasBasicEnergy || basicEnergyAttached;
            });
            if (!hasBasicEnergy || pokemonCount <= 1) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 1, max: 1, allowCancel: false }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    player.marker.addMarker(this.BLISSFUL_SWAP_MARKER, this);
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        if (cardList.getPokemonCard() === this) {
                            cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                        }
                    });
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    source.moveCardTo(transfer.card, target);
                }
                return state;
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.BLISSFUL_SWAP_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_DRAW_UNTIL_6), wantToUse => {
                if (wantToUse) {
                    while (player.hand.cards.length < 6) {
                        if (player.deck.cards.length === 0) {
                            break;
                        }
                        player.deck.moveTo(player.hand, 1);
                    }
                }
            });
        }
        return state;
    }
}
exports.Blisseyex = Blisseyex;
