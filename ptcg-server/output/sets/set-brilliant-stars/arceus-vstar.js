"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArceusVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class ArceusVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.stage = card_types_1.Stage.VSTAR;
        this.evolvesFrom = 'Arceus V';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 280;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Trinity Nova',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 200,
                text: 'Search your deck for up to 3 basic energies and attach ' +
                    'them to your Pokémon V in any way you like. Then, shuffle ' +
                    'your deck.'
            }
        ];
        this.powers = [{
                name: 'Starbirth',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'During your turn, you may search your deck for up to ' +
                    '2 cards and put them into your hand. Then, shuffle your ' +
                    'deck. (You can\'t use more than 1 VSTAR Power in a game.)'
            }];
        this.set = 'BRS';
        this.name = 'Arceus VSTAR';
        this.fullName = 'Arceus VSTAR BRS';
        this.VSTAR_MARKER = 'VSTAR_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.VSTAR_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.VSTAR_MARKER)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            player.marker.addMarker(this.VSTAR_MARKER, this);
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 2, allowCancel: false }), cards => {
                player.deck.moveCardsTo(cards, player.hand);
                state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
                return state;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: true, min: 0, max: 3 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    if (!target.cards[0].tags.includes(card_types_1.CardTag.POKEMON_V) &&
                        !target.cards[0].tags.includes(card_types_1.CardTag.POKEMON_VSTAR) &&
                        !target.cards[0].tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                        throw new game_1.GameError(game_1.GameMessage.INVALID_TARGET);
                    }
                    if (target.cards[0].tags.includes(card_types_1.CardTag.POKEMON_V) ||
                        target.cards[0].tags.includes(card_types_1.CardTag.POKEMON_VSTAR) ||
                        target.cards[0].tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                        player.deck.moveCardTo(transfer.card, target);
                    }
                }
                state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.ArceusVSTAR = ArceusVSTAR;
