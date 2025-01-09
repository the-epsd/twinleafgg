"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadiantCharizard = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class RadiantCharizard extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.RADIANT];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 160;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Excited Heart',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon\'s attacks cost C less for each Prize card your opponent has taken.'
            }];
        this.attacks = [
            {
                name: 'Combustion Blast',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 250,
                text: 'During your next turn, this Pokémon can\'t use Combustion Blast.'
            }
        ];
        this.set = 'CRZ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Radiant Charizard';
        this.fullName = 'Radiant Charizard CRZ';
        // public getColorlessReduction(state: State): number {
        //   const player = state.players[state.activePlayer];
        //   const opponent = StateUtils.getOpponent(state, player);
        //   const remainingPrizes = opponent.getPrizeLeft();
        //   return 6 - remainingPrizes;
        // }
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('second marker added');
        }
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // const index = effect.cost.indexOf(CardType.COLORLESS);
            // // No cost to reduce
            // if (index === -1) {
            //   return state;
            // }
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                console.log(effect.cost);
                return state;
            }
            const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
            // No cost to reduce
            if (index === -1) {
                return state;
            }
            const remainingPrizes = opponent.getPrizeLeft();
            const prizeToColorlessReduction = {
                5: 1,
                4: 2,
                3: 3,
                2: 4,
                1: 4
            };
            const colorlessToRemove = prizeToColorlessReduction[remainingPrizes] || 0;
            for (let i = 0; i < colorlessToRemove; i++) {
                const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                if (index !== -1) {
                    effect.cost.splice(index, 1);
                }
            }
            console.log(effect.cost);
            return state;
        }
        // if (effect instanceof KnockOutEffect) {
        //   const player = effect.player;
        //   const opponent = StateUtils.getOpponent(state, player);
        //   const duringTurn = [GamePhase.PLAYER_TURN, GamePhase.ATTACK].includes(state.phase);
        //   // Do not activate between turns, or when it's not opponents turn.
        //   if (!duringTurn || state.players[state.activePlayer] !== opponent) {
        //     return state;
        //   }
        //   const cardList = StateUtils.findCardList(state, this);
        //   const owner = StateUtils.findOwner(state, cardList);
        //   if (owner === player) {
        //     try {
        //       const stub = new PowerEffect(player, {
        //         name: 'test',
        //         powerType: PowerType.ABILITY,
        //         text: ''
        //       }, this);
        //       store.reduceEffect(state, stub);
        //     } catch {
        //       return state;
        //     }
        //     const card = effect.target.getPokemonCard();
        //     if (card !== undefined) {
        //       let costToReduce = 1;
        //       if (card.tags.includes(CardTag.POKEMON_EX) || card.tags.includes(CardTag.POKEMON_V) || card.tags.includes(CardTag.POKEMON_VSTAR) || card.tags.includes(CardTag.POKEMON_ex)) {
        //         costToReduce += 1;
        //       }
        //       if (card.tags.includes(CardTag.POKEMON_VMAX)) {
        //         costToReduce += 2;
        //       }
        //       const index = this.attacks[0].cost.indexOf(CardType.COLORLESS);
        //       if (index !== -1) {
        //         this.attacks[0].cost.splice(index, costToReduce);
        //         console.log(this.attacks[0].cost);
        //       }
        //     }
        //   }
        // }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Check marker
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                console.log('attack blocked');
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
            console.log('marker added');
        }
        return state;
    }
}
exports.RadiantCharizard = RadiantCharizard;
