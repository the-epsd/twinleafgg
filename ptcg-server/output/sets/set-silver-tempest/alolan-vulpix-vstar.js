"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlolanVulpixVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class AlolanVulpixVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VSTAR;
        this.evolvesFrom = 'Alolan Vulpix V';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 240;
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Snow Mirage',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 160,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon. During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Pokémon that have an Ability.'
            },
            {
                name: 'Silvery Snow Star',
                cost: [],
                damage: 70,
                text: 'This attack does 70 damage for each of your opponent\'s Pokémon V in play. This damage isn\'t affected by Weakness or Resistance. (You can\'t use more than 1 VSTAR Power in a game.)'
            }
        ];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.name = 'Alolan Vulpix VSTAR';
        this.fullName = 'Alolan Vulpix VSTAR SIT';
        this.VSTAR_MARKER = 'VSTAR_MARKER';
        this.SNOW_MIRAGE_MARKER = 'SNOW_MIRAGE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.SNOW_MIRAGE_MARKER, this);
            player.marker.removeMarker(this.VSTAR_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.marker.addMarker(this.SNOW_MIRAGE_MARKER, this);
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, 160);
            store.reduceEffect(state, applyWeakness);
            const damage = applyWeakness.damage;
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
                if (player.marker.hasMarker(this.SNOW_MIRAGE_MARKER, this)) {
                    const opponent = game_1.StateUtils.getOpponent(state, player);
                    if (opponent.active) {
                        const opponentActive = opponent.active.getPokemonCard();
                        if (opponentActive && opponentActive.powers.length > 0) {
                            if (effect instanceof attack_effects_1.PutDamageEffect) {
                                effect.preventDefault = true;
                            }
                        }
                    }
                }
            }
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
                const player = effect.player;
                const opponent = game_1.StateUtils.getOpponent(state, player);
                if (player.marker.hasMarker(this.VSTAR_MARKER)) {
                    throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
                }
                const benchPokemon = opponent.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined);
                const vPokemons = benchPokemon.filter(card => card.tags.includes(card_types_1.CardTag.POKEMON_V || card_types_1.CardTag.POKEMON_VSTAR || card_types_1.CardTag.POKEMON_VMAX));
                const opponentActive = opponent.active.getPokemonCard();
                if (opponentActive && opponentActive.tags.includes(card_types_1.CardTag.POKEMON_V || card_types_1.CardTag.POKEMON_VSTAR || card_types_1.CardTag.POKEMON_VMAX || card_types_1.CardTag.POKEMON_ex)) {
                    vPokemons.push(opponentActive);
                }
                let vPokes = vPokemons.length;
                if (opponentActive) {
                    vPokes++;
                }
                effect.ignoreResistance = true;
                effect.ignoreWeakness = true;
                effect.damage *= vPokes;
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.SNOW_MIRAGE_MARKER, this);
        }
        return state;
    }
}
exports.AlolanVulpixVSTAR = AlolanVulpixVSTAR;
