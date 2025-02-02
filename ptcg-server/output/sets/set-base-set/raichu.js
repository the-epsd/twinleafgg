"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raichu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Raichu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Raichu';
        this.set = 'BS';
        this.fullName = 'Raichu BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '14';
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.CLEAR_AGILITY_MARKER = 'CLEAR_AGILITY_MARKER';
        this.AGILITY_MARKER = 'AGILITY_MARKER';
        this.attacks = [
            {
                name: 'Agility',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Flip a coin. If heads, during your opponent’s next turn, prevent all effects of attacks, including damage, done to Raichu.'
            },
            {
                name: 'Thunder',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'Flip a coin. If tails, Raichu does 30 damage to itself.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP), (flipResult) => {
                if (flipResult) {
                    player.active.marker.addMarker(this.AGILITY_MARKER, this);
                    opponent.marker.addMarker(this.CLEAR_AGILITY_MARKER, this);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP), (flipResult) => {
                if (!flipResult) {
                    const damageEffect = new attack_effects_1.DealDamageEffect(effect, 30);
                    damageEffect.target = effect.player.active;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect &&
            effect.player.marker.hasMarker(this.CLEAR_AGILITY_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_AGILITY_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.AGILITY_MARKER, this);
            });
        }
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this) &&
            effect.target.marker.hasMarker(this.AGILITY_MARKER, this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if (sourceCard) {
                effect.preventDefault = true;
            }
            return state;
        }
        return state;
    }
}
exports.Raichu = Raichu;
