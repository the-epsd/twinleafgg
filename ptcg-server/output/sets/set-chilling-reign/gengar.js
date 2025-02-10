"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gengar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Gengar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Haunter';
        this.cardType = P;
        this.hp = 130;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Last Gift',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is Knocked Out by damage from an attack from your opponent\'s Pokémon, search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Pain Burst',
                cost: [C, C, C],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 40 more damage for each damage counter on your opponent\'s Active Pokémon.'
            }];
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '57';
        this.name = 'Gengar';
        this.fullName = 'Gengar CRE';
    }
    reduceEffect(store, state, effect) {
        // Last Gift
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
            store.log(state, game_1.GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, card: this.name });
            prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                if (!result) {
                    return state;
                }
                let cards = [];
                store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: Math.min(2, player.deck.cards.length), allowCancel: false }), selected => {
                    cards = selected || [];
                    player.deck.moveCardsTo(cards, player.hand);
                    prefabs_1.SHUFFLE_DECK(store, state, player);
                });
            });
        }
        // Pain Burst
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = effect.opponent;
            effect.damage += 4 * opponent.active.damage;
        }
        return state;
    }
}
exports.Gengar = Gengar;
