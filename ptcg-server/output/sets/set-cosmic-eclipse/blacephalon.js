"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blacephalon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Blacephalon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Fireworks Bomb',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put 4 damage counters on your opponent\'s Pokemon in any way you like. If your opponent has exactly 3 Prize cards remaining, put 12 damage counters on them instead.'
            }];
        this.set = 'CEC';
        this.name = 'Blacephalon';
        this.fullName = 'Blacephalon CEC';
        this.setNumber = '104';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const maxAllowedDamage = [];
            if (opponent.getPrizeLeft() != 3) {
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                    maxAllowedDamage.push({ target, damage: card.hp + 40 });
                });
                const damage = 40;
                return store.prompt(state, new game_1.PutDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], damage, maxAllowedDamage, { allowCancel: false }), targets => {
                    const results = targets || [];
                    for (const result of results) {
                        const target = game_1.StateUtils.getTarget(state, player, result.target);
                        const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, result.damage);
                        putCountersEffect.target = target;
                        store.reduceEffect(state, putCountersEffect);
                    }
                });
            }
            if (opponent.getPrizeLeft() === 3) {
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                    maxAllowedDamage.push({ target, damage: card.hp + 120 });
                });
                const damage = 120;
                return store.prompt(state, new game_1.PutDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], damage, maxAllowedDamage, { allowCancel: false }), targets => {
                    const results = targets || [];
                    for (const result of results) {
                        const target = game_1.StateUtils.getTarget(state, player, result.target);
                        const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, result.damage);
                        putCountersEffect.target = target;
                        store.reduceEffect(state, putCountersEffect);
                    }
                });
            }
        }
        return state;
    }
}
exports.Blacephalon = Blacephalon;
