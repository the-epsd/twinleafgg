"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkeledirgeEX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class SkeledirgeEX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Crocalor';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.cardType = M;
        this.hp = 330;
        this.retreat = [C, C, C];
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.powers = [{
                name: 'Incendiary Song',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may discard a Basic [R] Energy card from your hand in order to use this Ability. During this turn, attacks used by your Pokémon do 60 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).',
            }];
        this.attacks = [{
                name: 'Luster Burn',
                cost: [R, R],
                damage: 160,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
            }];
        this.regulationMark = 'H';
        this.set = 'PAR';
        this.name = 'Skeledirge ex';
        this.fullName = 'Skeledirge ex PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '137';
        this.INCENDIARY_SONG_MARKER = 'INCENDIARY_SONG_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.INCENDIARY_SONG_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.INCENDIARY_SONG_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard && c.name === 'Fire Energy';
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.INCENDIARY_SONG_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { min: 1, max: 1, allowCancel: false }), selected => {
                if (!selected || selected.length === 0) {
                    return state;
                }
                const card = selected[0];
                player.hand.moveCardTo(card, player.discard);
                player.marker.addMarker(this.INCENDIARY_SONG_MARKER, this);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect) {
            const player = effect.player;
            if (player.marker.hasMarker(this.INCENDIARY_SONG_MARKER, this)) {
                effect.damage += 60;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 160);
            store.reduceEffect(state, dealDamage);
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, dealDamage.damage);
            store.reduceEffect(state, applyWeakness);
            const damage = applyWeakness.damage;
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            // Target is this Pokemon
            if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.SkeledirgeEX = SkeledirgeEX;
