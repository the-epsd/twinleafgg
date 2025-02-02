"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecidueyeGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class DecidueyeGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dartrix';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 240;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Feather Arrow',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may put 2 damage counters on 1 of your opponent\'s Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Razor Leaf',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: ''
            },
            {
                name: 'Hollow Hunt-GX',
                cost: [card_types_1.CardType.GRASS],
                damage: 0,
                gxAttack: true,
                text: 'Put 3 cards from your discard pile into your hand. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'SUM';
        this.name = 'Decidueye-GX';
        this.fullName = 'Decidueye-GX SUM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.FEATHER_ARROW_MARKER = 'FEATHER_ARROW_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.FEATHER_ARROW_MARKER, this);
        }
        // Feather Arrow
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check marker
            if (player.marker.hasMarker(this.FEATHER_ARROW_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                player.marker.addMarker(this.FEATHER_ARROW_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                targets.forEach(target => {
                    target.damage += 20;
                });
            });
        }
        // Hollow Hunt-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
                const player = effect.player;
                if (player.discard.cards.length === 0) {
                    return state;
                }
                const max = Math.min(3);
                const min = max;
                return store.prompt(state, [
                    new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min, max, allowCancel: false })
                ], selected => {
                    const cards = selected || [];
                    player.discard.moveCardsTo(cards, player.hand);
                });
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.FEATHER_ARROW_MARKER, this);
        }
        return state;
    }
}
exports.DecidueyeGX = DecidueyeGX;
