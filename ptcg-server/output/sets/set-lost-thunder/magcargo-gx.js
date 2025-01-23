"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagcargoGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_2 = require("../../game");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
// LOT Magcargo-GX 44 (https://limitlesstcg.com/cards/LOT/44)
class MagcargoGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Slugma';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Crushing Charge',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may discard the top card of your deck. If it\'s a basic Energy card, attach it to 1 of your Pokémon. '
            }];
        this.attacks = [
            {
                name: 'Lava Flow',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'Discard any amount of basic Energy from this Pokémon. This attack does 50 more damage for each card you discarded in this way.'
            },
            {
                name: 'Burning Magma-GX',
                cost: [card_types_1.CardType.FIRE],
                damage: 0,
                text: 'Discard the top 5 cards of your opponent\'s deck. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'LOT';
        this.setNumber = '44';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Magcargo-GX';
        this.fullName = 'Magcargo-GX LOT';
        this.CRUSHING_CHARGE_MARKER = 'CRUSHING_CHARGE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.CRUSHING_CHARGE_MARKER, this);
        }
        // Crushing Charge
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.CRUSHING_CHARGE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const topOfTheDeck = new game_1.CardList();
            player.deck.moveTo(topOfTheDeck, 1);
            // Check if any cards discarded are basic energy
            const discardedEnergy = topOfTheDeck.cards.filter(card => {
                return card instanceof game_1.EnergyCard && card.energyType === card_types_1.EnergyType.BASIC;
            });
            if (discardedEnergy.length == 0) {
                player.marker.addMarker(this.CRUSHING_CHARGE_MARKER, this);
                topOfTheDeck.moveTo(player.discard);
            }
            if (discardedEnergy.length > 0) {
                store.prompt(state, new game_2.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, topOfTheDeck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                    transfers = transfers || [];
                    player.marker.addMarker(this.CRUSHING_CHARGE_MARKER, this);
                    for (const transfer of transfers) {
                        const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                        topOfTheDeck.moveCardTo(transfer.card, target);
                    }
                });
            }
            return state;
        }
        // Lava Flow
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let cards = [];
            store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.active, { superType: card_types_1.SuperType.ENERGY }, { min: 0, allowCancel: false }), selected => {
                cards = selected || [];
                effect.damage += cards.length * 50;
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
        }
        // Burning Magma-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            opponent.deck.moveTo(opponent.discard, 5);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.CRUSHING_CHARGE_MARKER, this);
        }
        return state;
    }
}
exports.MagcargoGX = MagcargoGX;
