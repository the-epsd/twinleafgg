"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Greninja = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Greninja extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Frogadier';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Evasion Jutsu',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'If any damage is done to this Pokémon by attacks, flip a coin. If heads, prevent that damage.'
            }];
        this.attacks = [
            {
                name: 'Furious Shurikens',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 0,
                text: 'This attack does 50 damage to 2 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'DET';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.name = 'Greninja';
        this.fullName = 'Greninja DET';
        this.usedMirageBarrage = false;
        this.blockDamage = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            if (pokemonCard !== this || sourceCard === undefined || state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
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
            try {
                const coinFlip = new play_card_effects_1.CoinFlipEffect(player);
                store.reduceEffect(state, coinFlip);
            }
            catch (_b) {
                return state;
            }
            const coinFlipResult = prefabs_1.SIMULATE_COIN_FLIP(store, state, player);
            if (coinFlipResult) {
                effect.damage = 0;
                store.log(state, game_message_1.GameLog.LOG_ABILITY_BLOCKS_DAMAGE, { name: opponent.name, pokemon: this.name });
            }
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let attackTargets = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, _ => attackTargets += 1);
            const min = Math.min(attackTargets, 2);
            const max = Math.min(attackTargets, 2);
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min, max, allowCancel: false }), target => {
                if (!target || target.length === 0) {
                    return;
                }
                const targets = target || [];
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 50);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
            });
            return state;
        }
        return state;
    }
}
exports.Greninja = Greninja;
