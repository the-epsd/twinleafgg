"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GardevoirGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
// BUS Gardevoir-GX 93 (https://limitlesstcg.com/cards/BUS/93)
class GardevoirGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kirlia';
        this.cardType = card_types_1.CardType.FAIRY;
        this.hp = 230;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.resistance = [{ type: card_types_1.CardType.DARK, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Secret Spring',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may attach a [Y] Energy card from your hand to 1 of your Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Infinite Force',
                cost: [card_types_1.CardType.FAIRY],
                damage: 30,
                text: 'This attack does 30 damage times the amount of Energy attached to both Active Pokémon.'
            },
            {
                name: 'Twilight-GX',
                cost: [card_types_1.CardType.FAIRY],
                damage: 0,
                gxAttack: true,
                text: 'Shuffle 10 cards from your discard pile into your deck. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'BUS';
        this.name = 'Gardevoir-GX';
        this.fullName = 'Gardevoir-GX BUS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.SPRING_MARKER = 'SPRING_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.SPRING_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.SPRING_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.SPRING_MARKER, this);
        }
        // Secret Spring
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard && c.name === 'Fairy Energy';
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.SPRING_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, name: 'Fairy Energy' }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                player.marker.addMarker(this.SPRING_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.hand.moveCardTo(transfer.card, target);
                }
            });
        }
        // Infinite Force
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const playerProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, playerProvidedEnergy);
            const playerEnergyCount = playerProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            const opponentProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, opponentProvidedEnergy);
            const opponentEnergyCount = opponentProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage = (playerEnergyCount + opponentEnergyCount) * 30;
        }
        // Twilight-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            // Player does not have correct cards in discard
            if (player.discard.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            let cards = [];
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, {}, { min: 1, max: 10, allowCancel: false }), selected => {
                cards = selected || [];
            });
            player.discard.moveCardsTo(cards, player.deck);
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        }
        return state;
    }
}
exports.GardevoirGX = GardevoirGX;
