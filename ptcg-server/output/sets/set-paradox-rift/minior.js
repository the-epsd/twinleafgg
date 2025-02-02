"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minior = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Minior extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Far-Flying Meteor',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is on your Bench, when you attach an Energy card from your hand to this Pokémon, you may switch it with your Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Gravitational Tackle',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost.'
            }];
        this.regulationMark = 'G';
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '99';
        this.name = 'Minior';
        this.fullName = 'Minior PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActiveCard = opponent.active.getPokemonCard();
            if (opponentActiveCard) {
                const retreatCost = opponentActiveCard.retreat.filter(c => c === card_types_1.CardType.COLORLESS).length;
                effect.damage = retreatCost * 20;
                return state;
            }
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.cards[0] == this) {
            const player = effect.player;
            const target = effect.target;
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
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    player.switchPokemon(target);
                }
            });
        }
        return state;
    }
}
exports.Minior = Minior;
