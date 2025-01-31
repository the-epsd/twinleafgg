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
const prefabs_1 = require("../../game/store/prefabs/prefabs");
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
                shredAttack: true,
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
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.name = 'Alolan Vulpix VSTAR';
        this.fullName = 'Alolan Vulpix VSTAR SIT';
        this.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER = 'PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER';
        this.CLEAR_PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER = 'CLEAR_PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
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
                const oppActive = opponent.active.getPokemonCard();
                if (oppActive && (oppActive === null || oppActive === void 0 ? void 0 : oppActive.powers.length) > 0) {
                    player.active.marker.addMarker(this.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER, this);
                    opponent.marker.addMarker(this.CLEAR_PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER, this);
                    console.log('marker added');
                }
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.usedVSTAR === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_VSTAR_USED);
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
            player.usedVSTAR = true;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            if (effect.target.marker.hasMarker(this.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER, this)) {
                const source = effect.source.getPokemonCard();
                if (!prefabs_1.IS_ABILITY_BLOCKED(store, state, effect.player, source)) {
                    effect.preventDefault = true;
                    return state;
                }
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.active.marker.hasMarker(this.CLEAR_PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER, this)) {
            effect.player.active.marker.removeMarker(this.CLEAR_PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                cardList.marker.removeMarker(this.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER, this);
            });
            console.log('marker removed');
        }
        return state;
    }
}
exports.AlolanVulpixVSTAR = AlolanVulpixVSTAR;
