"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetagrossGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class MetagrossGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Metang';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 250;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Geotech System',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may attach a [P] or [M] Energy card from your discard pile to your Active Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Giga Hammer',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 150,
                text: 'This Pokémon can\'t use Giga Hammer during your next turn.'
            },
            {
                name: 'Algorithm-GX',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                gxAttack: true,
                text: 'Search your deck for up to 5 cards and put them into your hand. Then, shuffle your deck. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'GRI';
        this.name = 'Metagross-GX';
        this.fullName = 'Metagross-GX GRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.GEOTECH_MARKER = 'GEOTECH_MARKER';
        this.HAMMER_MARKER_1 = 'HAMMER_MARKER_1';
        this.HAMMER_MARKER_2 = 'HAMMER_MARKER_2';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.EvolveEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.GEOTECH_MARKER, this);
        }
        // Geotech System
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && (c.provides.includes(card_types_1.CardType.PSYCHIC) || c.provides.includes(card_types_1.CardType.METAL));
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.GEOTECH_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max: 1, differentTypes: true, validCardTypes: [card_types_1.CardType.METAL, card_types_1.CardType.PSYCHIC] }), transfers => {
                transfers = transfers || [];
                player.marker.addMarker(this.GEOTECH_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
        }
        // Giga Hammer
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Check marker
            if (effect.player.marker.hasMarker(this.HAMMER_MARKER_1, this)) {
                console.log('attack blocked');
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.marker.addMarker(this.HAMMER_MARKER_1, this);
            console.log('marker added');
        }
        // Algorithm-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            if (player.deck.cards.length === 0) {
                return state;
            }
            let cards = [];
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 5, allowCancel: false }), selected => {
                cards = selected || [];
            });
            player.deck.moveCardsTo(cards, player.hand);
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.GEOTECH_MARKER, this);
            // removing the markers for preventing the pokemon from attacking
            if (effect.player.marker.hasMarker(this.HAMMER_MARKER_2, this)) {
                effect.player.marker.removeMarker(this.HAMMER_MARKER_1, this);
                effect.player.marker.removeMarker(this.HAMMER_MARKER_2, this);
                console.log('marker cleared');
            }
            if (effect.player.marker.hasMarker(this.HAMMER_MARKER_1, this)) {
                effect.player.marker.addMarker(this.HAMMER_MARKER_2, this);
                console.log('second marker added');
            }
        }
        return state;
    }
}
exports.MetagrossGX = MetagrossGX;
