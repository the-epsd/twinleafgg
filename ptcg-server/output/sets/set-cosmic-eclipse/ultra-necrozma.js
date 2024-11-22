"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UltraNecrozma = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
// CEC Ultra Necrozma 164 (https://limitlesstcg.com/cards/CEC/164)
class UltraNecrozma extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.ULTRA_BEAST]; // idk is this how you indicate that the pokemon is an ultra beast?
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.FAIRY }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Ultra Burst',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon can\'t attack unless your opponent has 2 or fewer Prize cards remaining.'
            }
        ];
        this.attacks = [
            {
                name: 'Luster of Downfall',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.METAL],
                damage: 170,
                text: 'Discard an Energy from your opponent\'s Active Pokémon.'
            }
        ];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '164';
        this.name = 'Ultra Necrozma';
        this.fullName = 'Ultra Necrozma CEC';
    }
    reduceEffect(store, state, effect) {
        // check to see if the opponent has less than 3 prize cards before allowing an attack
        // (Ultra Burst)
        if (effect instanceof game_effects_1.UseAttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
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
            if (opponent.getPrizeLeft() > 2) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        // Luster of Downfall
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const activeCardList = opponent.active;
            const activePokemonCard = activeCardList.getPokemonCard();
            let hasPokemonWithEnergy = false;
            if (activePokemonCard && activeCardList.cards.some(c => c.superType === card_types_1.SuperType.ENERGY)) {
                hasPokemonWithEnergy = true;
            }
            if (!hasPokemonWithEnergy) {
                return state;
            }
            let cards = [];
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
            });
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            return store.reduceEffect(state, discardEnergy);
        }
        return state;
    }
}
exports.UltraNecrozma = UltraNecrozma;
