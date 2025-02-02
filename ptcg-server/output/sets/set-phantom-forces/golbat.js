"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Golbat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_message_1 = require("../../game/game-message");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Golbat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Zubat';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [];
        this.powers = [{
                name: 'Sneaky Bite',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokemon from your hand to evolve 1 of your ' +
                    'Pokemon, you may put 2 damage counters on 1 of your opponent\'s Pokemon.'
            }];
        this.attacks = [
            {
                name: 'Swoop Across',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 10 damage to each of your opponent\'s Pokemon. ' +
                    '(Don\'t apply Weakness and Resistance for Benched Pokemon.)'
            }
        ];
        this.set = 'PHF';
        this.name = 'Golbat';
        this.fullName = 'Golbat PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: true }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    target.damage += 20;
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            effect.damage = 10;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (cardList === opponent.active) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                damageEffect.target = cardList;
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Golbat = Golbat;
