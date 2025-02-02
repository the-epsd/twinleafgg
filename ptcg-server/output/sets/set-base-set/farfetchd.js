"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Farfetchd = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Farfetchd extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Farfetch\'d';
        this.set = 'BS';
        this.fullName = 'Farfetch\'d BS';
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 50;
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.LEEK_SLAP_MARKER = 'LEEK_SLAP_MARKER';
        this.attacks = [
            {
                name: 'Leek Slap',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Flip a coin. If tails, this attack does nothing. Either way, you can’t use this attack again as long as Farfetch’d stays in play (even putting Farfetch’d on the Bench won’t let you use it again).'
            },
            {
                name: 'Pot Smash',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.LEEK_SLAP_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (effect.player.marker.hasMarker(this.LEEK_SLAP_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.LEEK_SLAP_CANNOT_BE_USED_AGAIN);
            }
            return store.prompt(state, [
                new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], (heads) => {
                if (!heads) {
                    effect.damage = 0;
                }
                effect.player.marker.addMarker(this.LEEK_SLAP_MARKER, this);
                return state;
            });
        }
        return state;
    }
}
exports.Farfetchd = Farfetchd;
