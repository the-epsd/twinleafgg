"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaSableyeTyranitarGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class MegaSableyeTyranitarGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TAG_TEAM];
        this.cardType = D;
        this.hp = 280;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Greedy Crush',
                cost: [D, D, D, D, C],
                damage: 210,
                text: 'If your opponent\'s Pokémon-GX or Pokémon-EX is Knocked Out by damage from this attack, take 1 more Prize card.'
            },
            {
                name: 'Gigafall-GX',
                cost: [D, D, D, D, C],
                damage: 250,
                text: 'If this Pokémon has at least 5 extra Energy attached to it (in addition to this attack\'s cost), discard the top 15 cards of your opponent\'s deck. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '126';
        this.name = 'Mega Sableye & Tyranitar-GX';
        this.fullName = 'Mega Sableye & Tyranitar-GX UNM';
        this.usedGreedyCrush = false;
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        // Greedy Crush (thank god for iron hands)
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            this.usedGreedyCrush = true;
        }
        // Gigafall-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            this.usedGreedyCrush = false;
            if (player.usedGX) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            player.usedGX = true;
            // Check for the extra energy cost.
            const extraEffectCost = [D, D, D, D, C, C, C, C, C, C];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (!meetsExtraEffectCost) {
                return state;
            } // If we don't have the extra energy, we just deal damage.
            // activate the millworks
            opponent.deck.moveTo(opponent.discard, 15);
        }
        // the prize taking effect
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target === effect.player.active) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (!this.usedGreedyCrush) {
                return state;
            }
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            // this isn't attacking
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            // Check if the attack that caused the KnockOutEffect is "Greedy Crush"
            if (this.usedGreedyCrush === true
                && (((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_GX)) || ((_b = effect.player.active.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(card_types_1.CardTag.POKEMON_EX)))) {
                if (effect.prizeCount > 0) {
                    effect.prizeCount += 1;
                    this.usedGreedyCrush = false;
                }
            }
            return state;
        }
        return state;
    }
}
exports.MegaSableyeTyranitarGX = MegaSableyeTyranitarGX;
