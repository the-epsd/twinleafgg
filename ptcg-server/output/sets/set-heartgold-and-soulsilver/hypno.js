"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hypno = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Hypno extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Drowzee';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Sleep Pendulum',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may flip a coin. ' +
                    'If heads, the Defending Pokemon is now Asleep. This power can\'t be ' +
                    'used if Hypno is affected by a Special Condition.'
            }];
        this.attacks = [
            {
                name: 'Psychic Shot',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Does 10 damage to 1 of your opponent\'s Benched Pokemon. ' +
                    '(Don\'t apply Weakness and Resistance for Benched Pokemon.)'
            }
        ];
        this.set = 'HS';
        this.name = 'Hypno';
        this.fullName = 'Hypno HS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
        this.SLEEP_PENDULUM_MAREKER = 'SLEEP_PENDULUM_MAREKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.SLEEP_PENDULUM_MAREKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList.specialConditions.length > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.SLEEP_PENDULUM_MAREKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            player.marker.addMarker(this.SLEEP_PENDULUM_MAREKER, this);
            if (opponent.active.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP)) {
                return state;
            }
            state = store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), result => {
                if (result) {
                    opponent.active.addSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
                }
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.SLEEP_PENDULUM_MAREKER, this)) {
            effect.player.marker.removeMarker(this.SLEEP_PENDULUM_MAREKER, this);
        }
        return state;
    }
}
exports.Hypno = Hypno;
