"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wugtrioex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Wugtrioex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Wiglett';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 250;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Tricolor Pump',
                cost: [card_types_1.CardType.WATER],
                damage: 0,
                text: 'Discard up to 3 Energy cards from your hand. This attack does 60 damage to 1 of your opponent\'s Pokémon for each Energy card you discarded in this way. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Numbing Hold',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 120,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
            },
        ];
        this.set = 'TEF';
        this.name = 'Wugtrio ex';
        this.fullName = 'Wugtrio ex TEF';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.NUMBING_HOLD_MARKER = 'NUMBING_HOLD_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Tricolor Pump
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let watersCount = 0;
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 3 }), cards => {
                cards = cards || [];
                watersCount = cards.length;
                player.hand.moveCardsTo(cards, player.discard);
            });
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 60 * watersCount);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        // Numbing Hold
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.NUMBING_HOLD_MARKER, this);
        }
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.marker.hasMarker(this.NUMBING_HOLD_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.NUMBING_HOLD_MARKER, this);
        }
        return state;
    }
}
exports.Wugtrioex = Wugtrioex;
