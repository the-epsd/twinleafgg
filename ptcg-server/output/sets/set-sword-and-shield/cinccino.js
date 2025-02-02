"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cinccino = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Cinccino extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Minccino';
        this.regulationMark = 'D';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Make Do',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'You must discard a card from your hand in order to use this Ability. Once during your turn, you may draw 2 cards.'
            }];
        this.attacks = [
            {
                name: 'Energy Assist',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 40,
                text: 'Attach a basic Energy card from your discard pile to 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'SSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '147';
        this.name = 'Cinccino';
        this.fullName = 'Cinccino SSH';
        this.REFINEMENT_MARKER = 'REFINEMENT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.REFINEMENT_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.hand.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.REFINEMENT_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: true, min: 1, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                player.marker.addMarker(this.REFINEMENT_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                player.hand.moveCardsTo(cards, player.discard);
                player.deck.moveTo(player.hand, 2);
            });
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.REFINEMENT_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            const hasBasicEnergy = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC;
            });
            if (hasBench === false || hasBasicEnergy === false) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.active.moveCardTo(transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.Cinccino = Cinccino;
