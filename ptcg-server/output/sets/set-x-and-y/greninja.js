"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreninjaXY = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class GreninjaXY extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Frogadier';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Water Shuriken',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may discard a [W] Energy card from your hand. If you do, put 3 damage counters on 1 of your opponent\'s Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Mist Slash',
                cost: [card_types_1.CardType.WATER],
                damage: 50,
                text: 'This attack\'s damage isn\'t affected by Weakness, Resistance, or any other effects on your opponent\'s Active Pokémon. '
            }
        ];
        this.set = 'XY';
        this.setNumber = '41';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Greninja';
        this.fullName = 'Greninja XY';
        this.WATER_SHURIKEN_MARKER = 'WATER_SHURIKEN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.WATER_SHURIKEN_MARKER, this);
        }
        // Water Shuriken
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            // Check marker
            if (player.marker.hasMarker(this.WATER_SHURIKEN_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            let waterInHand = false;
            player.hand.cards.forEach(card => {
                if (card.superType === card_types_1.SuperType.ENERGY && card.name === 'Water Energy') {
                    waterInHand = true;
                }
            });
            if (!waterInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY, name: 'Water Energy' }, { allowCancel: false, min: 1, max: 1 }), cards => {
                cards = cards || [];
                player.marker.addMarker(this.WATER_SHURIKEN_MARKER, this);
                player.hand.moveCardsTo(cards, player.discard);
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), result => {
                    const target = result[0];
                    target.damage += 30;
                    return state;
                });
            });
            return state;
        }
        // Mist Slash
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (effect.damage > 0) {
                opponent.active.damage += effect.damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, effect.damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.WATER_SHURIKEN_MARKER, this);
        }
        return state;
    }
}
exports.GreninjaXY = GreninjaXY;
