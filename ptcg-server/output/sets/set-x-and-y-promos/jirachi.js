"use strict";
// ptcg-server\src\sets\set-base-set\Jirachi.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jirachi = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Jirachi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Stardust',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Discard a Special Energy attached to your opponent\'s Active Pokémon.If you do, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
            }, {
                name: 'Dream Dance',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                text: 'Both Active Pokémon are now Asleep.',
                damage: 20
            }];
        this.set = 'XYP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.name = 'Jirachi';
        this.fullName = 'Jirachi XYP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            state = store.reduceEffect(state, checkProvidedEnergy);
            let hasPokemonWithEnergy = false;
            const blocked = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.cards.some(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.SPECIAL)) {
                    hasPokemonWithEnergy = true;
                }
                else {
                    blocked.push(target);
                }
            });
            if (!hasPokemonWithEnergy) {
                const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                store.reduceEffect(state, endTurnEffect);
                return state;
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL }, { min: 1, max: 1, allowCancel: true }), energy => {
                const cards = (energy || []);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = opponent.active;
                store.reduceEffect(state, discardEnergy);
                player.active.marker.addMarker(game_1.PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this);
                opponent.marker.addMarker(game_1.PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const active = opponent.active;
            active.addSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
            player.active.addSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect &&
            effect.player.marker.hasMarker(game_1.PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this)) {
            effect.player.marker.removeMarker(game_1.PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(game_1.PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this);
            });
        }
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this) &&
            effect.target.marker.hasMarker(game_1.PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if (sourceCard) {
                effect.preventDefault = true;
            }
            return state;
        }
        return state;
    }
}
exports.Jirachi = Jirachi;
