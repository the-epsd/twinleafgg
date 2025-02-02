"use strict";
// ptcg-server\src\sets\set-base-set\mewtwo.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mewtwo = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Mewtwo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Psychic',
                cost: [P, C],
                damage: 10,
                text: 'Does 10 damage plus 10 more damage for each Energy card attached to the Defending Pokémon.'
            }, {
                name: 'Barrier',
                cost: [P, P],
                text: 'Discard 1 {P} Energy card attached to Mewtwo in order to prevent all effects of attacks, including damage, done to Mewtwo during your opponent’s next turn.',
                damage: 0
            }];
        this.set = 'BS';
        this.name = 'Mewtwo';
        this.fullName = 'Mewtwo BS';
        this.setNumber = '10';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const energyCount = checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);
            effect.damage = 10 + energyCount * 10;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.PSYCHIC], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
                player.active.marker.addMarker(game_1.PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this);
                opponent.marker.addMarker(game_1.PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this);
            });
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
exports.Mewtwo = Mewtwo;
