"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoaringMoonex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class RoaringMoonex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.ANCIENT];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 230;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Frenzied Gouging',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Knock Out your opponent\'s Active Pokémon. If your opponent\'s Active Pokémon is Knocked Out in this way, this Pokémon does 200 damage to itself.'
            },
            {
                name: 'Calamity Storm',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 100,
                damageCalculation: '+',
                text: 'You may discard a Stadium in play. If you do, this attack does 120 more damage.'
            }
        ];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '124';
        this.name = 'Roaring Moon ex';
        this.fullName = 'Roaring Moon ex PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const activePokemon = opponent.active.getPokemonCard();
            if (activePokemon) {
                const dealDamage = new attack_effects_1.KnockOutOpponentEffect(effect, 999);
                dealDamage.target = opponent.active;
                store.reduceEffect(state, dealDamage);
            }
            if (game_phase_effects_1.BetweenTurnsEffect && activePokemon !== undefined) {
                const dealSelfDamage = new attack_effects_1.DealDamageEffect(effect, 200);
                dealSelfDamage.target = player.active;
                store.reduceEffect(state, dealSelfDamage);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard) {
                state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.CALAMITY_STORM), wantToUse => {
                    if (wantToUse) {
                        // Discard Stadium
                        const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                        if (cardList) {
                            const player = game_1.StateUtils.findOwner(state, cardList);
                            cardList.moveTo(player.discard);
                        }
                        effect.damage += 120;
                        return state;
                    }
                    return state;
                });
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.RoaringMoonex = RoaringMoonex;
