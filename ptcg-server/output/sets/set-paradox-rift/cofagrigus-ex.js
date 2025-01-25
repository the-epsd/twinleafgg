"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cofagrigusex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Cofagrigusex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Yamask';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 260;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Gold Coffin',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is Knocked Out by damage from an attack from your opponent\'s Pokémon, search your deck for a card and put it into your hand. Then, shuffle your deck.'
            }];
        this.attacks = [
            {
                name: 'Hollow Hands',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 110,
                text: 'Put 5 damage counters on your opponent\'s Benched Pokémon in any way you like.'
            }
        ];
        this.set = 'PAR';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.name = 'Cofagrigus ex';
        this.fullName = 'Cofagrigus ex PAR';
    }
    reduceEffect(store, state, effect) {
        // Gold Coffin
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            // i love checking for ability lock woooo
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            if (player.deck.cards.length === 0) {
                return state;
            }
            store.log(state, game_1.GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, card: 'Cofagrigus ex' });
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                player.deck.moveCardsTo(cards, player.hand);
            });
            store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        }
        // Hollow Hands
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            const maxAllowedDamage = [];
            let damageLeft = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                const checkHpEffect = new check_effects_1.CheckHpEffect(opponent, cardList);
                store.reduceEffect(state, checkHpEffect);
                damageLeft += checkHpEffect.hp - cardList.damage;
                maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
            });
            const damage = Math.min(50, damageLeft);
            return store.prompt(state, new game_2.PutDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], damage, maxAllowedDamage, { allowCancel: false }), targets => {
                const results = targets || [];
                for (const result of results) {
                    const target = state_utils_1.StateUtils.getTarget(state, player, result.target);
                    const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, result.damage);
                    putCountersEffect.target = target;
                    store.reduceEffect(state, putCountersEffect);
                }
            });
        }
        return state;
    }
}
exports.Cofagrigusex = Cofagrigusex;
