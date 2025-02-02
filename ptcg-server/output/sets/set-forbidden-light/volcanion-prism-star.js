"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolcanionPS = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class VolcanionPS extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.PRISM_STAR];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 160;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Jet Geyser',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may discard a [W] Energy card from your hand. If you do, your opponent switches their Active Pokémon with 1 of their Benched Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Sauna Blast',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 100,
                text: 'This attack does 20 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'FLI';
        this.setNumber = '31';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Volcanion Prism Star';
        this.fullName = 'Volcanion Prism Star FLI';
        this.JET_GEYSER_MARKER = 'JET_GEYSER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.JET_GEYSER_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.hand.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.JET_GEYSER_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY, name: 'Water Energy' }, { allowCancel: false, min: 1, max: 1 }), cards => {
                cards = cards || [];
                player.marker.addMarker(this.JET_GEYSER_MARKER, this);
                player.hand.moveCardsTo(cards, player.discard);
                return store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                    const cardList = result[0];
                    opponent.switchPokemon(cardList);
                });
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (cardList !== opponent.active) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                    damageEffect.target = cardList;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.JET_GEYSER_MARKER, this);
        }
        return state;
    }
}
exports.VolcanionPS = VolcanionPS;
