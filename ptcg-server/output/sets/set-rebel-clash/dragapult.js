"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragapult = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dragapult extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.regulationMark = 'D';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [];
        this.powers = [{
                name: 'Infiltrator',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'If any damage is done to this Pokémon by attacks, flip a coin. If heads, prevent that damage.'
            }];
        this.attacks = [
            {
                name: 'Phantom Force',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 120,
                text: 'Put 3 damage counters on your opponent\'s Benched Pokémon in any way you like.'
            }
        ];
        this.set = 'RCL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.evolvesFrom = 'Drakloak';
        this.name = 'Dragapult';
        this.fullName = 'Dragapult RCL';
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
                store.log(state, game_1.GameLog.LOG_ABILITY_BLOCKS_DAMAGE, { name: opponent.name, pokemon: this.name });
            }
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const maxAllowedDamage = [];
            const oppHasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!oppHasBenched) {
                return state;
            }
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                maxAllowedDamage.push({ target, damage: card.hp + 30 });
            });
            return store.prompt(state, new game_1.PutDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], 30, maxAllowedDamage, { allowCancel: false }), targets => {
                const results = targets || [];
                for (const result of results) {
                    const target = game_1.StateUtils.getTarget(state, player, result.target);
                    const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, result.damage);
                    putCountersEffect.target = target;
                    store.reduceEffect(state, putCountersEffect);
                }
            });
        }
        return state;
    }
}
exports.Dragapult = Dragapult;
